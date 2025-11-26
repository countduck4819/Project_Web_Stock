import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Repository, Not, In } from 'typeorm';
import { BaseServices } from '../Base/base.services';
import { StockRecommendationEntity } from './stock-recommendations.entities';
import { StockEntity } from '../Stocks/stocks.entities';
import {
  BaseResDataI,
  HttpStatusCode,
  ResponseCode,
  StockRecommendationRepository,
  StockRecommendationsServiceI,
  StockRecommendationStatus,
  StocksRepository,
} from 'src/shared';
import { StockRecommendationResI } from 'src/shared/type/stock-recommendations';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StockRecommendationsService
  extends BaseServices<StockRecommendationEntity>
  implements StockRecommendationsServiceI, OnModuleInit
{
  private readonly logger = new Logger(StockRecommendationsService.name);

  constructor(
    @Inject(StockRecommendationRepository)
    protected readonly recommendationRepo: Repository<StockRecommendationEntity>,
    @Inject(StocksRepository)
    protected readonly stockRepo: Repository<StockEntity>,
  ) {
    super(recommendationRepo);
  }

  async findPaginated(
    query: Record<string, any>,
  ): Promise<BaseResDataI<StockRecommendationResI[] | null>> {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const { page: _p, limit: _l, search, ...condition } = query;
      const qb = this.recommendationRepo
        .createQueryBuilder('rec')
        .leftJoinAndSelect('rec.stock', 'stock')
        .orderBy('rec.id', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (condition.status) {
        qb.andWhere('rec.status = :status', { status: condition.status });
      }

      if (search) {
        qb.andWhere(
          '(rec.note ILIKE :search OR stock.code ILIKE :search OR stock.name ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      const [data, total] = await qb.getManyAndCount();

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: 'Lấy danh sách khuyến nghị cổ phiếu thành công',
        data: data as any,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Lỗi findPaginated:', error);
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  /* ===========================================================
     📊 LẤY DANH SÁCH MÃ CHƯA ACTIVE
  =========================================================== */
  async getAvailableStocks(): Promise<BaseResDataI<any>> {
    try {
      const activeRecs = await this.recommendationRepo.find({
        where: { status: StockRecommendationStatus.ACTIVE },
      });

      const usedStockIds = activeRecs.map((r) => r.stockId);

      const availableStocks = await this.stockRepo.find({
        where: usedStockIds.length ? { id: Not(In(usedStockIds)) } : {},
      });

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: 'Lấy danh sách mã cổ phiếu chưa được khuyến nghị thành công',
        data: availableStocks,
      };
    } catch (error) {
      this.logger.error('Lỗi getAvailableStocks:', error);
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (error as Error).message,
        data: null,
      };
    }
  }

  /* ===========================================================
     🧠 TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI
  =========================================================== */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async autoUpdateRecommendationStatus(): Promise<void> {
    this.logger.log('🔁 Đang kiểm tra trạng thái khuyến nghị...');

    const activeRecs = await this.recommendationRepo.find({
      where: { status: StockRecommendationStatus.ACTIVE },
      relations: ['stock'],
    });

    for (const rec of activeRecs) {
      try {
        const symbol = rec.stock?.code;
        if (!symbol) continue;

        const res = await fetch(
          `${process.env.PYTHON_API_URL}/stock/${symbol}`,
        );
        const candles = await res.json();
        const latest = candles[candles.length - 1];
        const currentPrice = +latest.close;

        if (currentPrice >= +rec.targetPrice) {
          rec.status = StockRecommendationStatus.TARGET_HIT;
          (rec as any).closedAt = new Date();
          await this.recommendationRepo.save(rec);
          this.logger.log(`${symbol}: đạt chốt lời (${currentPrice})`);
        } else if (currentPrice <= +rec.stopLossPrice) {
          rec.status = StockRecommendationStatus.STOP_LOSS;
          (rec as any).closedAt = new Date();
          await this.recommendationRepo.save(rec);
          this.logger.log(`${symbol}: bị cắt lỗ (${currentPrice})`);
        }
      } catch (err) {
        this.logger.error(`Lỗi cập nhật cho ${rec.stock?.code}`, err);
      }
    }
  }

  /* ===========================================================
     🧹 XÓA SAU 2 NGÀY KHI CHỐT LỜI / CẮT LỖ
  =========================================================== */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async autoDeleteExpiredRecommendations(): Promise<void> {
    const now = new Date();
    const expiredLimit = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const expiredRecs = await this.recommendationRepo
      .createQueryBuilder('rec')
      .where('rec.status IN (:...statuses)', {
        statuses: [
          StockRecommendationStatus.TARGET_HIT,
          StockRecommendationStatus.STOP_LOSS,
        ],
      })
      .andWhere('rec.closedAt <= :expiredLimit', { expiredLimit })
      .getMany();

    if (expiredRecs.length > 0) {
      await this.recommendationRepo.remove(expiredRecs);
      const codes = expiredRecs.map((r) => r.stockId).join(', ');
      this.logger.log(
        `🗑️ Đã xóa ${expiredRecs.length} khuyến nghị hết hạn (${codes}).`,
      );
    } else {
      this.logger.log('✨ Không có khuyến nghị nào hết hạn.');
    }
  }

  /* ===========================================================
     🚀 GỌI DỌN DẸP NGAY KHI KHỞI ĐỘNG
  =========================================================== */
  async onModuleInit() {
    this.logger.log('🚀 Kiểm tra khuyến nghị hết hạn khi khởi động...');
    await this.autoDeleteExpiredRecommendations();
  }
}

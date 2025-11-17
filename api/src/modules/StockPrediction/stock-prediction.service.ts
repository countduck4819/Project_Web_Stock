import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  StockPredictionRepository,
  StockPredictionServiceI,
  HttpStatusCode,
  ResponseCode,
  BaseResDataI,
  StockPredictionResI,
} from 'src/shared';
import { BaseServices } from '../Base/base.services';
import { StockPredictionEntity } from './stock-prediction.entities';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StockPredictionService
  extends BaseServices<StockPredictionEntity>
  implements StockPredictionServiceI, OnModuleInit
{
  private readonly logger = new Logger(StockPredictionService.name);

  // Đường dẫn đúng tới file JSON (hoạt động cả ở src và dist)
  private readonly jsonPath = path.resolve(
    process.cwd(),
    '../predict_xgboost_and_lstm/predict_top50_stocks.json',
  );

  constructor(
    @Inject(StockPredictionRepository)
    protected readonly repo: Repository<StockPredictionEntity>,
  ) {
    super(repo);
  }

  /** Khởi chạy server → auto import + theo dõi file */
  async onModuleInit() {
    await this.initAndWatchFile();
  }

  /** Theo dõi file + import lần đầu */
  private async initAndWatchFile() {
    if (!fs.existsSync(this.jsonPath)) {
      this.logger.error(`❌ Không tìm thấy file JSON: ${this.jsonPath}`);
      return;
    }

    this.logger.log('🔄 Khởi động: Import dữ liệu dự đoán...');
    await this.importFromJson();

    // Watch file mỗi 3 giây
    fs.watchFile(this.jsonPath, { interval: 3000 }, async (curr, prev) => {
      if (curr.mtimeMs !== prev.mtimeMs) {
        this.logger.log('🟡 File JSON thay đổi → Import lại dữ liệu...');
        await this.importFromJson();
      }
    });
  }

  /** Đọc file JSON */
  private readPredictionFile() {
    try {
      if (!fs.existsSync(this.jsonPath)) return null;
      const raw = fs.readFileSync(this.jsonPath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      this.logger.error('❌ Lỗi đọc file JSON', err);
      return null;
    }
  }

  /** Import từ JSON vào DB */
  async importFromJson() {
    const data = this.readPredictionFile();

    if (!data) {
      this.logger.error('❌ Không tìm thấy dữ liệu JSON để import');
      return {
        success: false,
        message: 'Không tìm thấy file dự đoán hoặc file rỗng.',
      };
    }

    // Xóa dữ liệu cũ (tránh trùng dữ liệu)
    await this.repo.clear();

    for (const ticker of Object.keys(data)) {
      const item = data[ticker];
      const last = item.future[item.future.length - 1];

      await this.repo.save({
        ticker,
        lastClosePrice: item.last_close_price,
        predictedPrice: last.predicted_close,
        chartPath: item.chart_path || null,
        predictedOn: new Date(item.predicted_on),
      });
    }

    this.logger.log('✅ Import dữ liệu dự đoán thành công');

    return {
      success: true,
      message: 'Import dự đoán thành công',
    };
  }

  /** Lưu từng prediction */
  async savePrediction(dto: {
    ticker: string;
    lastClosePrice: number;
    predictedPrice: number;
    chartPath?: string | null;
  }) {
    return await this.repo.save({
      ticker: dto.ticker,
      lastClosePrice: dto.lastClosePrice,
      predictedPrice: dto.predictedPrice,
      chartPath: dto.chartPath ?? null,
      predictedOn: new Date(),
    });
  }

  /** Lấy dự đoán mới nhất theo mã */
  async getLatest(
    ticker: string,
  ): Promise<BaseResDataI<StockPredictionResI | null>> {
    const entity = await this.repo.findOne({
      where: { ticker },
      order: { predictedOn: 'DESC' },
    });

    if (!entity) {
      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: 'Không có dự đoán cho mã này',
        data: null,
      };
    }

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: 'Lấy dự đoán mới nhất thành công',
      data: entity as unknown as StockPredictionResI,
    };
  }

  /** Phân trang */
  async findAll(query: Record<string, any>) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || null;

    const condition: any = {};
    const searchFilters: any = search ? { ticker: search } : undefined;
    return await this.paginate(condition, page, limit, searchFilters);
  }
}

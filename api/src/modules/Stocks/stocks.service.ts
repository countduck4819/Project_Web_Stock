import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseServices } from '../Base/base.services';
import { StocksRepository, StocksServiceI } from 'src/shared';
import { StockEntity } from './stocks.entities';
import { IndustryEntity } from '../Industries/industries.entities';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StockService
  extends BaseServices<StockEntity>
  implements StocksServiceI, OnModuleInit
{
  private readonly logger = new Logger(StockService.name);

  private readonly jsonPath = path.resolve(
    process.cwd(),
    '../data/stocks_by_industries.json',
  );
  private readonly listingPath = path.resolve(
    process.cwd(),
    '../data/listing.json',
  );

  constructor(
    @Inject(StocksRepository)
    protected readonly stockRepository: Repository<StockEntity>,
  ) {
    super(stockRepository);
  }

  /** =======================
   * 🔹 Giữ nguyên các hàm gốc
   * ======================= */
  async findByIndustry(industryId: number) {
    return this.find({ industryId });
  }

  async getListingStock() {
    return this.getJsonData('listing.json');
  }

  async getStockSymbols() {
    return this.getJsonData('stocks_symbols.json');
  }

  /** =======================
   * 🔹 Đồng bộ dữ liệu từ JSON
   * ======================= */
  async onModuleInit() {
    await this.syncFromJson();
  }

  private readJson(filePath: string): any {
    try {
      if (!fs.existsSync(filePath)) return null;
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      this.logger.error(`❌ Lỗi đọc file ${filePath}:`, err.message);
      return null;
    }
  }

  private async syncFromJson() {
    const data = this.readJson(this.jsonPath);
    const listing = this.readJson(this.listingPath);

    if (!data || Object.keys(data).length === 0) {
      this.logger.warn(
        '⚠️ File stocks_by_industries.json rỗng hoặc sai định dạng',
      );
      return;
    }

    const nameMap = new Map<string, string>(
      (Array.isArray(listing) ? listing : []).map((i: any) => [
        String(i.symbol).trim(),
        String(i.organ_name || '').trim(),
      ]),
    );

    const industriesRepo =
      this.stockRepository.manager.getRepository(IndustryEntity);
    const industries = await industriesRepo.find();
    const industryMap = new Map<string, number>(
      industries.map((i) => [i.name.trim(), i.id]),
    );

    const existing = await this.stockRepository.find();
    const existingCodes = new Set(existing.map((s) => s.code));

    const toInsert: Partial<StockEntity>[] = [];
    const toUpdate: { id: number; name: string; industryId: number }[] = [];

    for (const [industryNameRaw, symbols] of Object.entries(data)) {
      const industryName = industryNameRaw.trim();
      const industryId = industryMap.get(industryName);

      if (!industryId) {
        this.logger.warn(
          `⚠️ Không tìm thấy ngành "${industryName}" trong DB — bỏ qua`,
        );
        continue;
      }

      for (const code of symbols as string[]) {
        const companyName = nameMap.get(code) || code;
        const existingStock = existing.find((s) => s.code === code);

        if (!existingStock) {
          toInsert.push({ code, name: companyName, industryId });
        } else {
          const needUpdate =
            existingStock.industryId !== industryId ||
            !existingStock.name ||
            existingStock.name === code;

          if (needUpdate) {
            toUpdate.push({
              id: existingStock.id,
              name: companyName,
              industryId,
            });
          }
        }
      }
    }

    if (toInsert.length > 0) {
      await this.stockRepository.insert(toInsert);
      this.logger.log(`➕ Đã thêm ${toInsert.length} cổ phiếu mới`);
    }

    if (toUpdate.length > 0) {
      for (const stock of toUpdate) {
        await this.stockRepository.update(stock.id, {
          name: stock.name,
          industryId: stock.industryId,
        });
      }
      this.logger.log(`📝 Đã cập nhật ${toUpdate.length} cổ phiếu (tên/ngành)`);
    }

    this.logger.log('✅ Đồng bộ stocks_by_industries.json → DB hoàn tất');
  }

  /** =======================
   * 🔹 Override paginate() để JOIN industry
   * ======================= */
  async paginate(condition: Record<string, any> = {}, page = 1, limit = 10) {
    try {
      const qb = this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.industry', 'industry')
        .select([
          'stock.id',
          'stock.code',
          'stock.name',
          'industry.id',
          'industry.name',
        ])
        .where('stock.active = true')
        .andWhere('stock.deletedAt IS NULL');

      // 🎯 Bỏ qua page, limit
      delete condition.page;
      delete condition.limit;

      // 🔍 Nếu có search → tìm theo code hoặc name (ILIKE)
      if (condition.search) {
        const s = `%${String(condition.search).trim()}%`;
        qb.andWhere('(stock.code ILIKE :search OR stock.name ILIKE :search)', {
          search: s,
        });
      }

      // Các điều kiện khác nếu có (industryId, ...)
      for (const [key, value] of Object.entries(condition)) {
        if (!value || key === 'search') continue;
        qb.andWhere(`stock.${key} = :${key}`, { [key]: value });
      }

      qb.orderBy('stock.id', 'ASC');

      const [data, total] = await qb
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        status: 200,
        code: 1,
        message: 'Lấy danh sách cổ phiếu thành công',
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`❌ paginate() lỗi: ${error.message}`);
      return {
        status: 200,
        code: 1,
        message: 'Không tìm thấy dữ liệu phù hợp',
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      };
    }
  }
}

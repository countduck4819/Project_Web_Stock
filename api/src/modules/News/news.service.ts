import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  HttpStatusCode,
  NewsRepository,
  NewsServiceI,
  ResponseCode,
} from 'src/shared';
import { BaseServices } from '../Base/base.services';
import { NewsEntity } from './news.entities';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService
  extends BaseServices<NewsEntity>
  implements NewsServiceI
{
  constructor(
    @Inject(NewsRepository)
    protected readonly newsRepository: Repository<NewsEntity>,
  ) {
    // ⚡ Ép kiểu rõ ràng để tránh lỗi TS 'never'
    super(newsRepository as unknown as Repository<NewsEntity>);
  }

  //   Đọc dữ liệu từ file JSON Python export
  async getFromJson(symbol: string) {
    try {
      const filePath = path.join(
        process.cwd(),
        '../data/news',
        `${symbol}_news.json`,
      );
      if (!fs.existsSync(filePath)) {
        return {
          status: HttpStatusCode.NOT_FOUND,
          code: ResponseCode.ERROR,
          message: `Không tìm thấy file news cho ${symbol}`,
          data: null,
        };
      }

      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Đọc JSON thành công`,
        data,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: `Lỗi đọc JSON: ${(e as Error).message}`,
        data: null,
      };
    }
  }

  //   Lưu batch tin tức mới từ JSON vào DB (mỗi lần 10 bài)
  async importBatch(symbol: string, page = 1, limit = 10) {
    const jsonRes = await this.getFromJson(symbol);
    if (!jsonRes.data || !jsonRes.data.data) return jsonRes;

    const allNews = jsonRes.data.data;
    const start = (page - 1) * limit;
    const batch = allNews.slice(start, start + limit);

    const insertData = batch.map((item: any) => ({
      news_id: item.news_id,
      news_title: item.news_title || '',
      news_sub_title: item.news_sub_title || '',
      news_short_content: item.news_short_content || '',
      news_full_content: item.news_full_content || '',
      news_image_url: item.news_image_url || '',
      news_source_link: item.news_source_link || '',
      public_date: item.public_date || null,
      slug: item.slug || item.news_id,
      symbol: symbol.toUpperCase(),
      active: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
    }));

    // ⚙️ Bulk insert, bỏ qua nếu news_id đã tồn tại
    const result = await this.newsRepository
      .createQueryBuilder()
      .insert()
      .into(NewsEntity)
      .values(insertData)
      .onConflict(`("news_id") DO NOTHING`)
      .execute();

    const insertedCount = result.raw?.length || result.identifiers?.length || 0;
    const skippedCount = batch.length - insertedCount;

    // 🧩 Đồng bộ lại sequence để ID nối tiếp chính xác
    // — đặt lại sequence = MAX(id)
    await this.newsRepository.query(`
    SELECT setval(
      pg_get_serial_sequence('"news"', 'id'),
      COALESCE((SELECT MAX(id) FROM "news"), 0),
      true
    );
  `);

    // — Kiểm tra lại cho chắc (tuỳ chọn)
    const check = await this.newsRepository.query(`
    SELECT last_value FROM ${'"'}news_id_seq${'"'};
  `);

    console.log('✅ Sequence synced to', check[0]?.last_value);

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: `Đã thêm ${insertedCount} bài mới, bỏ qua ${skippedCount} bài trùng. ID giờ nối tiếp 100%.`,
      data: {
        total: batch.length,
        inserted: insertedCount,
        skipped: skippedCount,
      },
    };
  }

  //   Phân trang tin tức từ DB
  async paginateNews(page = 1, limit = 10, symbol?: string) {
    const qb = this.newsRepository
      .createQueryBuilder('news')
      .where('news.active = true')
      .orderBy('news.public_date', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    // ✅ Các mã khác: lọc theo symbol như cũ
    // ✅ VNINDEX: KHÔNG lọc symbol → lấy tất cả news active, sort theo public_date
    if (symbol && symbol !== 'VNINDEX') {
      qb.andWhere('news.symbol = :symbol', { symbol });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: 'Lấy tin tức thành công',
      data,
      meta: { page, limit, total },
    };
  }

  async findBySlug(slug: string) {
    console.log(slug);
    const news = await this.newsRepository.findOne({ where: { slug } });

    if (!news) {
      return {
        status: HttpStatusCode.NOT_FOUND,
        code: ResponseCode.ERROR,
        message: `Không tìm thấy bài viết với slug ${slug}`,
        data: null,
      };
    }

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: `Chi tiết bài viết: ${news.news_title}`,
      data: news,
    };
  }

  // 🔍 Tìm kiếm + phân trang tin tức (chỉ theo title & slug)
  async searchNews(page = 1, limit = 10, keyword?: string) {
    const qb = this.newsRepository
      .createQueryBuilder('news')
      .where('news.active = true');

    // 🔸 Tìm trong tiêu đề & slug
    if (keyword) {
      qb.andWhere(
        `(LOWER(news.news_title) LIKE LOWER(:kw)
        OR LOWER(news.slug) LIKE LOWER(:kw))`,
        { kw: `%${keyword}%` },
      );
    }

    qb.orderBy('news.public_date', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: 'Tìm kiếm tin tức thành công',
      data,
      meta: { page, limit, total },
    };
  }
}

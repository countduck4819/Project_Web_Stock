import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { NewsServiceToken } from 'src/shared';
import { NewsService } from './news.service';
import { Public } from 'src/shared/decorator/is-public.decorator';

@ApiBearerAuth()
@Controller('/news')
export class NewsController {
  constructor(
    @Inject(NewsServiceToken)
    private readonly newsService: NewsService,
  ) {}

  //   Lấy batch từ JSON (và lưu vào DB nếu chưa có)
  @Public()
  @Post('/import/:symbol')
  async importBatch(
    @Param('symbol') symbol: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.newsService.importBatch(symbol, Number(page), Number(limit));
  }

  //   Lấy dữ liệu gốc JSON (chưa lưu DB)
  @Public()
  @Get('/json/:symbol')
  async getJson(@Param('symbol') symbol: string) {
    return this.newsService.getFromJson(symbol);
  }

  @Public()
  @Get('/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.newsService.findBySlug(slug);
  }

  //   Lấy tin tức trong DB (phân trang)
  @Public()
  @Get()
  async getPaginated(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('symbol') symbol?: string,
  ) {
    return this.newsService.paginateNews(Number(page), Number(limit), symbol);
  }

  // 🔍 Tìm kiếm tin tức (phân trang + keyword)
  @Public()
  @Get('/search')
  async searchNews(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.newsService.searchNews(Number(page), Number(limit), keyword);
  }
}

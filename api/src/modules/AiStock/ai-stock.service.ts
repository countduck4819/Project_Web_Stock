import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Groq from 'groq-sdk';
import {
  AiStockAskReqI,
  AiStockAskResI,
  AiStockRepository,
  AiStockServiceI,
  BaseResDataI,
  HttpStatusCode,
  ResponseCode,
  StocksRepository,
} from 'src/shared';
import { Repository } from 'typeorm';
import { BaseServices } from 'src/modules/Base/base.services';
import { AiStockHistoryEntity } from './entities/ai-stock-history.entity';
import { StockEntity } from '../Stocks/stocks.entities';

@Injectable()
export class AiStockService
  extends BaseServices<AiStockHistoryEntity>
  implements AiStockServiceI
{
  private stockCodes: string[] = [];
  private readonly logger = new Logger(AiStockService.name);

  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  private async loadStockCodes() {
    const rows = await this.stockRepository.find({
      select: ['code'],
      where: { active: true },
    });

    this.stockCodes = rows.map((r) => r.code.toUpperCase());
    this.logger.log(`Loaded ${this.stockCodes.length} stock codes.`);
  }
  constructor(
    @Inject(AiStockRepository)
    protected readonly aiStockRepository: Repository<AiStockHistoryEntity>,
    private readonly http: HttpService,
    @Inject(StocksRepository)
    protected readonly stockRepository: Repository<StockEntity>,
  ) {
    super(aiStockRepository);

    this.loadStockCodes();
  }
  private detectSymbol(question: string): string | null {
    if (!question) return null;

    const words = question
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2 && w.length <= 5);

    for (const w of words) {
      if (this.stockCodes.includes(w)) {
        return w;
      }
    }

    return null;
  }

  private async fetchPrice(symbol: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${process.env.PYTHON_API}/stock/${symbol}`),
      );
      return res.data;
    } catch {
      return null;
    }
  }

  /** Python API: finance */
  private async fetchFinance(symbol: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${process.env.PYTHON_API}/finance/${symbol}`),
      );
      return res.data;
    } catch {
      return null;
    }
  }

  /** Nest API: news */
  private async fetchNews(symbol: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${process.env.PYTHON_API}/news/${symbol}`, {
          params: { symbol, limit: 1, page: 1 },
        }),
      );

      return res.data?.data || [];
    } catch {
      return [];
    }
  }

  /** Summarize news */
  private async buildNewsSnippet(latest: any | null) {
    if (!latest) return null;

    const title = latest.news_title || '';
    const slug = latest.slug || '';
    const link = slug ? `${process.env.HOST_WEB}/tin-tuc/${slug}` : '';

    if (latest.news_short_content) {
      return {
        title,
        summary: latest.news_short_content,
        link,
      };
    }

    if (latest.news_full_content) {
      const result = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Tóm tắt đoạn sau thành 1–2 câu, bỏ hết HTML:\n${latest.news_full_content}`,
          },
        ],
        temperature: 0.25,
      });

      return {
        title,
        summary: result.choices[0].message.content,
        link,
      };
    }

    return { title, summary: title, link };
  }

  async askStockAi(
    body: AiStockAskReqI,
  ): Promise<BaseResDataI<AiStockAskResI>> {
    const { userId, question } = body;

    const symbol = this.detectSymbol(question);
    /** CASE A — NO SYMBOL → trả HTML + lưu lịch sử */
    if (!symbol) {
      const answerHtml = `
        <p><b>Không tìm thấy mã cổ phiếu</b> trong câu hỏi.</p>
        <p>Vui lòng nhập mã như <b>VCB</b>, <b>FPT</b>, <b>SSI</b>.</p>
      `;

      await this.aiStockRepository.save({
        userId,
        question,
        symbol: null,
        answer: answerHtml,
      });

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: 'AI trả lời thành công',
        data: {
          symbol: null,
          answer: answerHtml,
        },
      };
    }

    /** CASE B — CÓ SYMBOL */
    const [priceData, financeData, newsList] = await Promise.all([
      this.fetchPrice(symbol),
      this.fetchFinance(symbol),
      this.fetchNews(symbol),
    ]);
    console.log('1', newsList);
    const latestNews = newsList[0] || null;
    const newsSnippet = await this.buildNewsSnippet(latestNews);
    console.log('2', newsSnippet);
    const lastCandle = Array.isArray(priceData)
      ? priceData[priceData.length - 1]
      : null;

    const newsText = newsSnippet
      ? `
Tiêu đề: ${newsSnippet.title}
Tóm tắt: ${newsSnippet.summary}
Link: ${newsSnippet.link}
    `.trim()
      : 'Không có tin tức.';

    /** Build AI context */
    const context = `
DỮ LIỆU CỔ PHIẾU: ${symbol}

[GIÁ GẦN NHẤT]
${lastCandle ? JSON.stringify(lastCandle) : 'Không có dữ liệu giá.'}

[CHỈ SỐ TÀI CHÍNH]
${financeData ? JSON.stringify(financeData) : 'Không có dữ liệu tài chính.'}

[TIN TỨC MỚI NHẤT]
${newsText}

- Trả lời HTML.
- Dùng <p>, <b>, <i>, <br>, <ul>, <li>, <a>.
    `.trim();

    const ai = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `${`
Bạn là AI chuyên gia chứng khoán Việt Nam. 
Bạn CHỈ được trả lời các câu hỏi liên quan đến:
- chứng khoán
- cổ phiếu
- tài chính doanh nghiệp
- thị trường
- phân tích kỹ thuật / cơ bản
- kinh tế

NẾU câu hỏi KHÔNG liên quan đến chứng khoán → trả lời đúng mẫu sau:

"<p><b>Xin lỗi!</b> Tôi chỉ hỗ trợ các câu hỏi liên quan đến chứng khoán, cổ phiếu và tài chính. Vui lòng đặt câu hỏi phù hợp.</p>"

TUYỆT ĐỐI KHÔNG trả lời linh tinh về các chủ đề khác.
`}`,
        },
        { role: 'user', content: context },
        { role: 'user', content: question },
      ],
      temperature: 0.25,
    });

    const answerHtml = ai.choices[0].message.content;

    /** Save history */
    await this.aiStockRepository.save({
      userId,
      question,
      symbol,
      answer: answerHtml,
    });

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: 'AI trả lời thành công',
      data: {
        symbol,
        answer: answerHtml,
      },
    };
  }

  async getHistoryByUser(
    userId: number,
  ): Promise<BaseResDataI<AiStockAskResI[]>> {
    // 1. Validate userId
    if (!userId || isNaN(userId)) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        code: ResponseCode.ERROR,
        message: 'userId không hợp lệ',
        data: [],
      };
    }

    const history = await this.aiStockRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    if (!history.length) {
      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: 'Không có lịch sử chat',
        data: [],
      };
    }

    return {
      status: HttpStatusCode.OK,
      code: ResponseCode.SUCCESS,
      message: 'Lấy lịch sử thành công',
      data: history.map((h) => ({
        question: h.question,
        answer: h.answer,
        symbol: h.symbol,
        createdAt: h.createdAt,
      })),
    };
  }
}

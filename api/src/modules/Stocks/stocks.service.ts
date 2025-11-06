import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { BaseServices } from '../Base/base.services';
import { StocksRepository, StocksServiceI } from 'src/shared';
import { StockEntity } from './stocks.entities';
// import * as fs from 'fs';
// import * as path from 'path';
// import axios from 'axios';
@Injectable()
export class StockService
  extends BaseServices<StockEntity>
  implements StocksServiceI
{
  protected stocksCache = null;
  constructor(
    @Inject(StocksRepository)
    protected readonly stockRepository: Repository<StockEntity>,
  ) {
    super(stockRepository);
  }

  async findByIndustry(industryId: number) {
    return this.find({ industryId });
  }

  // getDataVnstock() {
  //   if (this.stocksCache) return this.stocksCache;

  //   const filePath = path.join(process.cwd(), '../data/listing.json');
  //   const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  //   this.stocksCache = data;

  //   setTimeout(() => (this.stocksCache = null), 12 * 60 * 60 * 1000);

  //   return data;
  // }

  async getListingStock() {
    return this.getJsonData('listing.json');
  }

  async getStockSymbols() {
    return this.getJsonData('stocks_symbols.json');
  }

  // async getFromPython() {
  //   const { data } = await axios.get('http://fireant_data:6060/stocks');
  //   return data;
  // }
}

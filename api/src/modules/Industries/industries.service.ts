import { IndustryEntity } from './industries.entities';
import { IndustryRepository, IndustryServiceI } from 'src/shared';
import { Inject, Injectable } from '@nestjs/common';
import { BaseServices } from '../Base/base.services';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
// import axios from 'axios';
@Injectable()
export class IndustryService
  extends BaseServices<IndustryEntity>
  implements IndustryServiceI
{
  protected industriesCache = null;
  constructor(
    @Inject(IndustryRepository)
    protected readonly industryRepository: Repository<IndustryEntity>,
  ) {
    super(industryRepository);
  }

  async getIndustries() {
    return this.getJsonData('industries.json');
  }

  async getStocksByIndustries() {
    return this.getJsonData('stocks_by_industries.json');
  }

  

  // async getFromPython() {
  //   const { data } = await axios.get('http://fireant_data:6060/industries');
  //   return data;
  // }
}

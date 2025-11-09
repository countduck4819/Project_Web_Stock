import { IndustryEntity } from 'src/modules/Industries/industries.entities';
import { NewsEntity } from 'src/modules/News/news.entities';
import { StockEntity } from 'src/modules/Stocks/stocks.entities';
import { UsersEntities } from 'src/modules/Users/users.entities';
import { DATA_SOURCE } from 'src/shared/const';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'db',
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [UsersEntities, IndustryEntity, StockEntity, NewsEntity],
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];

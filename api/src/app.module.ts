import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './modules/Users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/Auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuardToken } from './shared';
import { RolesGuard } from './shared/guard/roles-guard.guard';
import { UploadModule } from './modules/UploadFile/upload.module';
import { IndustryModule } from './modules/Industries/industries.module';
import { StocksModule } from './modules/Stocks/stocks.module';
import { NewsModule } from './modules/News/news.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    UploadModule,
    IndustryModule,
    StocksModule,
    NewsModule,
  ],
  controllers: [],
  providers: [
    AppService,
    { provide: APP_GUARD, useExisting: JwtAuthGuardToken },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

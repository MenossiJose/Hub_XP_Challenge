import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { S3Module } from './s3/s3.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ProductModule, CategoryModule, OrderModule, S3Module, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

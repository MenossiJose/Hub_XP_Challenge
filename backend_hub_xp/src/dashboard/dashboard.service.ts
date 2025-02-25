import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../order/schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getDashboardData(filters: {
    categoryId?: string;
    productId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { categoryId, productId, startDate, endDate } = filters;

    const matchStage: any = {};

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        matchStage.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.date.$lte = new Date(endDate);
      }
    }

    if (productId) {
      matchStage.productIds = { $in: [productId] };
    }

    // Para filtragem por categoria, precisamos de uma lógica mais complexa
    // que busque primeiro os produtos da categoria
    let productFilter = {};
    if (categoryId) {
      const db = this.orderModel.db?.db;
      if (!db) {
        throw new Error('Database connection is not available');
      }
      const productCollection = db.collection('products');

      const productsInCategory = await productCollection
        .find({
          categoryIds: { $in: [categoryId] },
        })
        .toArray();

      const productIds = productsInCategory.map((p) => p._id);

      matchStage.productIds = { $in: productIds };
    }

    // Agregação para métricas
    const aggregateResult = await this.orderModel
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            avgOrderValue: { $avg: '$total' },
          },
        },
      ])
      .exec();

    // Agregação para pedidos por período (mensal)
    const ordersByPeriod = await this.orderModel
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            count: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
        {
          $project: {
            _id: 0,
            period: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $toString: '$_id.month' },
              ],
            },
            count: 1,
            revenue: 1,
          },
        },
        { $sort: { period: 1 } },
      ])
      .exec();

    const metrics = aggregateResult[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    };

    return {
      ...metrics,
      ordersByPeriod,
    };
  }
}

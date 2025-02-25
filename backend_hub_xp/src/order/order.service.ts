import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productService: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { productIds, ...orderData } = createOrderDto;

    // Validar produtos
    if (productIds && productIds.length > 0) {
      for (const productId of productIds) {
        await this.productService.findOne(productId);
      }
    }

    const order = new this.orderModel({
      ...orderData,
      productIds: productIds.map((id) => new Types.ObjectId(id)),
    });

    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('productIds').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('productIds')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { productIds, ...orderData } = updateOrderDto;

    // Validar produtos
    if (productIds && productIds.length > 0) {
      for (const productId of productIds) {
        await this.productService.findOne(productId);
      }
    }

    const updateData: any = { ...orderData };

    if (productIds) {
      updateData.productIds = productIds.map((id) => new Types.ObjectId(id));
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('productIds')
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();

    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return deletedOrder;
  }
}

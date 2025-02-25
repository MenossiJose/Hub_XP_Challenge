import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, ...productData } = createProductDto;

    // Validar categorias
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await this.categoryService.findOne(categoryId);
      }
    }

    const product = new this.productModel({
      ...productData,
      categoryIds: categoryIds
        ? categoryIds.map((id) => new Types.ObjectId(id))
        : [],
    });

    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('categoryIds').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryIds')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { categoryIds, ...productData } = updateProductDto;

    // Validar categorias
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await this.categoryService.findOne(categoryId);
      }
    }

    const updateData: Partial<Product> = { ...productData };

    if (categoryIds) {
      updateData.categoryIds = categoryIds.map(
        (id) => new Types.ObjectId(id) as unknown as Schema.Types.ObjectId,
      );
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('categoryIds')
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return deletedProduct;
  }
}

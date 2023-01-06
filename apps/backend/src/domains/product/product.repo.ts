import { Injectable, Logger } from '@nestjs/common';
import { PrismaClientService } from '../../database/prisma/prisma-client.service';
import { Product } from 'src/domains/product/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/domains/product/product.dto';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(private prisma: PrismaClientService) {}

  async create(data: CreateProductDto): Promise<Product> {
    const storedProduct = await this.prisma.product.create({ data });
    return new Product(storedProduct as Product);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return isNotEmpty(product) ? new Product(product as Product) : null;
  }

  async findByUserId(userId: string): Promise<Product[] | null> {
    const products = await this.prisma.product.findMany({
      where: { userId },
    });
    return isNotEmpty(products)
      ? products.map((product) => new Product(product))
      : [];
  }

  async updateById(id: string, newProduct: UpdateProductDto): Promise<Product> {
    let updatedProduct;
    try {
      updatedProduct = await this.prisma.product.update({
        where: {
          id,
        },
        data: newProduct,
      });
    } catch (error) {
      this.logger.debug(error);
    }
    return isNotEmpty(updatedProduct) ? new Product(updatedProduct) : null;
  }

  async deleteById(id: string): Promise<Product | null> {
    let deletedProduct;
    try {
      deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.debug(error);
    }
    return isNotEmpty(deletedProduct) ? new Product(deletedProduct) : null;
  }
}

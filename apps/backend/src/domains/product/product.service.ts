import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product, ProductValidator } from './product.entity';
import { DataServiceService } from 'src/database/data-service.service';
import { ErrorResponse } from 'src/lib/response.dto';
import { isEmpty } from 'class-validator';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private dataService: DataServiceService) {}

  async create(createProductDto: CreateProductDto) {
    // validasi data
    const product = new Product(createProductDto);
    const productValidation = new ProductValidator(product);
    if (!productValidation.isAllPropsValid()) {
      this.logger.debug(
        `Product data is not valid ${JSON.stringify(
          productValidation.getValidationErrors(),
          undefined,
          2,
        )}`,
      );
      this.logger.log(
        `Product creation failed ${JSON.stringify({
          name: createProductDto.name,
        })}`,
      );
      throw new BadRequestException(
        new ErrorResponse({
          message: 'Data tidak valid',
          errors: productValidation.getValidationErrors(),
        }),
      );
    }
    // simpan product
    const storedProduct = await this.dataService.product.create(product);
    this.logger.debug(
      `Stored product ${JSON.stringify(storedProduct, undefined, 2)}`,
    );
    this.logger.log(
      `Product created ${JSON.stringify({ productId: storedProduct.id })}`,
    );
    return storedProduct;
  }

  async findByUserId(userId: string) {
    const products = this.dataService.product.findByUserId(userId);
    return products;
  }

  async updateById(id: string, updateProductDto: UpdateProductDto) {
    // validasi data
    const product = new Product(updateProductDto);
    const productValidation = new ProductValidator(product, {
      forUpdate: true,
    });
    if (!productValidation.isAllPropsValid()) {
      this.logger.debug(
        `Product data is not valid ${JSON.stringify(
          productValidation.getValidationErrors(),
          undefined,
          2,
        )}`,
      );
      this.logger.log(
        `Product update failed ${JSON.stringify({
          id: id,
        })}`,
      );
      throw new BadRequestException(
        new ErrorResponse({
          message: 'Data tidak valid',
          errors: productValidation.getValidationErrors(),
        }),
      );
    }
    // update product
    const updatedProduct = await this.dataService.product.updateById(
      id,
      product,
    );
    this.logger.debug(
      `Updated product ${JSON.stringify(updatedProduct, undefined, 2)}`,
    );
    this.logger.log(
      `Product created ${JSON.stringify({ productId: updatedProduct.id })}`,
    );
    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.dataService.product.deleteById(id);
    if (isEmpty(deletedProduct)) {
      this.logger.log(
        `Product deletion failed ${JSON.stringify({
          productId: id,
        })}`,
      );
      throw new BadRequestException(
        new ErrorResponse({ message: 'Product gagal dihapus' }),
      );
    }
    this.logger.log(
      `Product deleted ${JSON.stringify({ ProductId: deletedProduct.id })}`,
    );
    return deletedProduct;
  }
}

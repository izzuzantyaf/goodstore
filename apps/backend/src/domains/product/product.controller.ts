import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';
import { UpdateProductDto } from './product.dto';
import { SuccessfulResponse } from 'src/lib/response.dto';

@Controller('api')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('products')
  async create(@Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productService.create(createProductDto);
    return new SuccessfulResponse({
      message: 'Product created',
      data: newProduct,
    });
  }

  @Get('users/:userId/products')
  async findByUserId(@Param('userId') userId: string) {
    const products = await this.productService.findByUserId(userId);
    return new SuccessfulResponse({
      message: 'Products found',
      data: products,
    });
  }

  @Patch('products/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateById(
      id,
      updateProductDto,
    );
    return new SuccessfulResponse({
      message: 'Product updated',
      data: updatedProduct,
    });
  }

  @Delete('products/:id')
  async remove(@Param('id') id: string) {
    const deletedProduct = await this.productService.remove(id);
    return new SuccessfulResponse({
      message: 'Product deleted',
      data: deletedProduct,
    });
  }
}

import { PickType } from '@nestjs/swagger';
import { Product } from './product.entity';

export class CreateProductDto extends PickType(Product, ['name', 'userId']) {}

export class UpdateProductDto extends PickType(Product, ['name']) {}

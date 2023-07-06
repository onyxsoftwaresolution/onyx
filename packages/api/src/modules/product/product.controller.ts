import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertProductDTO } from './dtos/product.in.dto';
import { ProductService } from './product.service';

@Controller({
  version: '1',
  path: '',
})
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get('product/:id')
  @Roles(Role.ADMIN)
  async getProduct(@Param('id') id: number) {
    return await this.productService.getProduct(id);
  }

  @Get('products')
  @Roles(Role.ADMIN, Role.USER)
  async listProducts() {
    return await this.productService.listProducts();
  }

  @Put('product')
  @Roles(Role.ADMIN)
  async upsertProduct(@Body() data: UpsertProductDTO) {
    return await this.productService.upsertProduct(data);
  }

  @Delete('product/:id')
  @Roles(Role.ADMIN)
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.deleteProduct(id);
  }
}

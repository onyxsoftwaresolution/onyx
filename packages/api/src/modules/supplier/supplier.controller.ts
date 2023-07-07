import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertSupplierDTO } from './dtos/supplier.in.dto';
import { SupplierService } from './supplier.service';

@Controller({
  version: '1',
  path: '',
})
export class SupplierController {
  constructor(private supplierService: SupplierService) { }

  @Get('supplier/:id')
  @Roles(Role.ADMIN)
  async getSupplier(@Param('id') id: number) {
    return await this.supplierService.getSupplier(id);
  }

  @Get('supplier/:id/products')
  @Roles(Role.ADMIN, Role.USER)
  async listSupplierProducts(@Param('id') id: number) {
    return await this.supplierService.listSupplierProducts(id);
  }

  @Get('suppliers')
  @Roles(Role.ADMIN, Role.USER)
  async listSuppliers() {
    return await this.supplierService.listSuppliers();
  }

  @Put('supplier')
  @Roles(Role.ADMIN)
  async upsertSupplier(@Body() data: UpsertSupplierDTO) {
    return await this.supplierService.upsertSupplier(data);
  }

  @Delete('supplier/:id')
  @Roles(Role.ADMIN)
  async deleteSupplier(@Param('id') id: number) {
    return await this.supplierService.deleteSupplier(id);
  }
}

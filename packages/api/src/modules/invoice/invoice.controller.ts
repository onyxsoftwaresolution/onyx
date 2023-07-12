import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertInvoiceDTO } from './dtos/invoice.in.dto';
import { InvoiceService } from './invoice.service';
import { QueryPaths } from '@common/QueryParams';
import { Type } from 'class-transformer';

@Controller({
  version: '1',
  path: '',
})
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) { }

  @Get('invoice/:id')
  @Roles(Role.ADMIN)
  async getInvoice(
    @Param('id') id: number,
    @Query('paths') paths: string,
  ) {
    return await this.invoiceService.getInvoice(id, new QueryPaths(paths));
  }

  @Get('invoice/:number/url')
  @Roles(Role.ADMIN)
  async getInvoiceUrl(
    @Param('number') invoiceNumber: string,
  ) {
    return await this.invoiceService.getInvoiceUrl(invoiceNumber);
  }

  @Get('project/:id/invoices')
  @Roles(Role.ADMIN, Role.USER)
  async listProjectInvoices(@Param('id') id: number) {
    return await this.invoiceService.listProjectInvoices(id);
  }

  @Put('invoice')
  @Roles(Role.ADMIN)
  async upsertInvoice(@Body() data: UpsertInvoiceDTO) {
    return await this.invoiceService.upsertInvoice(data);
  }

  @Delete('invoice/:id')
  @Roles(Role.ADMIN)
  async deleteInvoice(@Param('id') id: number) {
    return await this.invoiceService.deleteInvoice(id);
  }
}

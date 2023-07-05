import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertInvoiceDTO } from './dtos/invoice.in.dto';
import { InvoiceService } from './invoice.service';

@Controller({
  version: '1',
  path: '',
})
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) { }

  @Get('invoice/:id')
  @Roles(Role.ADMIN)
  async getInvoice(@Param('id') id: number) {
    return await this.invoiceService.getInvoice(id);
  }

  @Get('invoices')
  @Roles(Role.ADMIN, Role.USER)
  async listInvoices() {
    return await this.invoiceService.listInvoices();
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

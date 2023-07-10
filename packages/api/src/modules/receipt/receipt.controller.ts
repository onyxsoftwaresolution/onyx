import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertReceiptDTO } from './dtos/receipt.in.dto';
import { ReceiptService } from './receipt.service';

@Controller({
  version: '1',
  path: '',
})
export class ReceiptController {
  constructor(private receiptService: ReceiptService) { }

  @Get('receipt/:id')
  @Roles(Role.ADMIN)
  async getReceipt(@Param('id') id: number) {
    return await this.receiptService.getReceipt(id);
  }

  @Get('project/:id/receipts')
  @Roles(Role.ADMIN, Role.USER)
  async listProjectReceipts(@Param('id') id: number) {
    return await this.receiptService.listProjectReceipts(id);
  }

  @Put('receipt')
  @Roles(Role.ADMIN)
  async upsertReceipt(@Body() data: UpsertReceiptDTO) {
    return await this.receiptService.upsertReceipt(data);
  }

  @Delete('receipt/:id')
  @Roles(Role.ADMIN)
  async deleteReceipt(@Param('id') id: number) {
    return await this.receiptService.deleteReceipt(id);
  }
}

import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertContractDTO } from '../dtos/contract.in.dto';
import { ContractService } from '../service/contract.service';

@Controller({
  version: '1',
  path: '',
})
export class ContractController {
  constructor(private contractService: ContractService) { }

  @Get('contracts')
  @Roles(Role.ADMIN, Role.USER)
  async listContracts() {
    return await this.contractService.listContracts();
  }

  @Get('contract/:id')
  @Roles(Role.ADMIN, Role.USER)
  async getContract(@Param('id') id: number) {
    return await this.contractService.getContract(id);
  }

  @Put('contract')
  @Roles(Role.ADMIN)
  async upsertContract(@Body() data: UpsertContractDTO) {
    return await this.contractService.upsertContract(data);
  }

  @Delete('contract/:id')
  @Roles(Role.ADMIN)
  async deleteContract(@Param('id') id: number) {
    return await this.contractService.deleteContract(id);
  }
}
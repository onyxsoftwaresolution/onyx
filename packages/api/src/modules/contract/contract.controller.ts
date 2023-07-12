import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put, Res } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertContractDTO } from './dtos/contract.in.dto';
import { ContractService } from './contract.service';
import { AllowAnonymous } from '@modules/auth/rbac/anonymous.decorator';
import { Response } from 'express';

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

  @Get('view-contract/:id')
  @AllowAnonymous()
  async viewContract(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.contractService.viewContract(res, id);
  }
}
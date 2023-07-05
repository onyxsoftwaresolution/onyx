import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertCostDTO } from './dtos/cost.in.dto';
import { CostService } from './cost.service';

@Controller({
  version: '1',
  path: '',
})
export class CostController {
  constructor(private costService: CostService) { }

  @Get('cost/:id')
  @Roles(Role.ADMIN)
  async getCost(@Param('id') id: number) {
    return await this.costService.getCost(id);
  }

  @Get('costs')
  @Roles(Role.ADMIN, Role.USER)
  async listCosts() {
    return await this.costService.listCosts();
  }

  @Put('cost')
  @Roles(Role.ADMIN)
  async upsertCost(@Body() data: UpsertCostDTO) {
    return await this.costService.upsertCost(data);
  }

  @Delete('cost/:id')
  @Roles(Role.ADMIN)
  async deleteCost(@Param('id') id: number) {
    return await this.costService.deleteCost(id);
  }
}

import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertClientDTO } from '../dtos/client.in.dto';
import { ClientService } from '../service/client.service';

@Controller({
  version: '1',
  path: '',
})
export class ClientController {
  constructor(private clientService: ClientService) { }

  @Get('clients')
  @Roles(Role.ADMIN, Role.USER)
  async listClients() {
    return await this.clientService.listClients();
  }

  @Put('client')
  @Roles(Role.ADMIN)
  async upsertClient(@Body() data: UpsertClientDTO) {
    return await this.clientService.upsertClient(data);
  }

  @Delete('client/:id')
  @Roles(Role.ADMIN)
  async deleteClient(@Param('id') id: number) {
    return await this.clientService.deleteClient(id);
  }
}

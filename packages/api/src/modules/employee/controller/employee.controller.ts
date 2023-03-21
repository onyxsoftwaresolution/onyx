import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertEmployeeDTO } from '../dtos/employee.in.dto';
import { EmployeeService } from '../service/employee.service';

@Controller({
  version: '1',
  path: '',
})
export class EmployeeController {
  constructor(private employeeService: EmployeeService) { }

  @Get('employees')
  @Roles(Role.ADMIN, Role.USER)
  async listEmployees() {
    return await this.employeeService.listEmployees();
  }

  @Put('employee')
  @Roles(Role.ADMIN)
  async upsertEmployee(@Body() data: UpsertEmployeeDTO) {
    return await this.employeeService.upsertEmployee(data);
  }

  @Delete('employee/:id')
  @Roles(Role.ADMIN)
  async deleteEmployee(@Param('id') id: number) {
    return await this.employeeService.deleteEmployee(id);
  }
}

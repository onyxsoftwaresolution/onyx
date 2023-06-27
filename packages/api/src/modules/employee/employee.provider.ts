import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  UpsertEmployeeDTO,
} from './dtos/employee.in.dto';

@Injectable()
export class EmployeeProvider {
  constructor(private prismaService: PrismaService) { }

  async createEmployee(data: CreateEmployeeDTO) {
    return await this.prismaService.client.employee.create({
      data,
      select: {
        id: true,
        name: true,
        available: true,
        created: true,
        modified: true,
        deleted: true,
        position: true,
      },
    });
  }

  async listEmployees() {
    return await this.prismaService.client.employee.findMany({
      where: { deleted: false, available: true },
    });
  }

  async updateEmployee({ id, ...data }: UpdateEmployeeDTO) {
    return await this.prismaService.client.employee.update({
      data,
      where: { id },
    });
  }

  async upsertEmployee({ id, ...data }: UpsertEmployeeDTO) {
    return await this.prismaService.client.employee.upsert({
      where: id != null ? { id } : { id: -1 },
      create: data,
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteEmployee(id: number) {
    return await this.prismaService.client.employee.update({
      where: { id },
      data: { deleted: true },
    });
  }
}

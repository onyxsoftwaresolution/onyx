import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateEmployeeDTO } from '../dtos/employee.in.dto';

@Injectable()
export class EmployeeProvider {
  constructor(private prismaService: PrismaService) {}

  async createEmployee(createEmployee: CreateEmployeeDTO) {
    return await this.prismaService.client.employee.create({
      data: createEmployee,
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
}

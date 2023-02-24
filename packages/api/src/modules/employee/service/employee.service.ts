import { Injectable } from '@nestjs/common';
import { CreateEmployeeDTO } from '../dtos/employee.in.dto';
import { EmployeeOutDTO } from '../dtos/employee.out.dto';
import { EmployeeProvider } from '../provider/employee.provider';

@Injectable()
export class EmployeeService {
  constructor(private employeeProvider: EmployeeProvider) {}

  async createEmployee(createEmployee: CreateEmployeeDTO) {
    return new EmployeeOutDTO(
      await this.employeeProvider.createEmployee(createEmployee),
    );
  }
}

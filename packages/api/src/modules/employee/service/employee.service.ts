import { Injectable } from '@nestjs/common';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  UpsertEmployeeDTO,
} from '../dtos/employee.in.dto';
import { EmployeeOutDTO } from '../dtos/employee.out.dto';
import { EmployeeProvider } from '../provider/employee.provider';

@Injectable()
export class EmployeeService {
  constructor(private employeeProvider: EmployeeProvider) { }

  async createEmployee(data: CreateEmployeeDTO) {
    return new EmployeeOutDTO(await this.employeeProvider.createEmployee(data));
  }

  async listEmployees() {
    const employees = await this.employeeProvider.listEmployees();
    return employees.map((e) => new EmployeeOutDTO(e));
  }

  async updateEmployee(data: UpdateEmployeeDTO) {
    return new EmployeeOutDTO(await this.employeeProvider.updateEmployee(data));
  }

  async upsertEmployee(data: UpsertEmployeeDTO) {
    return new EmployeeOutDTO(await this.employeeProvider.upsertEmployee(data));
  }

  async deleteEmployee(id: number) {
    return new EmployeeOutDTO(await this.employeeProvider.deleteEmployee(id));
  }
}

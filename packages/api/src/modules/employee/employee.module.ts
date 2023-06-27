import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { EmployeeService } from './employee.service';
import { EmployeeProvider } from './employee.provider';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeService, EmployeeProvider],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule { }

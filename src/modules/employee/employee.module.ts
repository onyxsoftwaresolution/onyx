import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { EmployeeService } from './service/employee.service';
import { EmployeeProvider } from './provider/employee.provider';
import { EmployeeController } from './controller/employee.controller';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeService, EmployeeProvider],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}

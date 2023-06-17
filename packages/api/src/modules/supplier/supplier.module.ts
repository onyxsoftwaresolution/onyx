import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { SupplierService } from './service/supplier.service';
import { SupplierProvider } from './provider/supplier.provider';
import { SupplierController } from './controller/supplier.controller';

@Module({
  imports: [PrismaModule],
  providers: [SupplierService, SupplierProvider],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule { }

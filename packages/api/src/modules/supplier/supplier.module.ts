import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { SupplierService } from './supplier.service';
import { SupplierProvider } from './supplier.provider';
import { SupplierController } from './supplier.controller';

@Module({
  imports: [PrismaModule],
  providers: [SupplierService, SupplierProvider],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule { }

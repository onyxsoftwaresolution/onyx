import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ProductService } from './product.service';
import { ProductProvider } from './product.provider';
import { ProductController } from './product.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductService, ProductProvider],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }

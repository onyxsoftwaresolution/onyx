import { UpsertSupplierDTO } from '@modules/supplier/dtos/supplier.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateProductInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  created?: string | Date;
  modified?: string | Date;
  deleted?: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @IsEmpty()
  @Type(() => UpsertSupplierDTO)
  supplier: UpsertSupplierDTO;
}

export class CreateProductDTO extends PickType(CreateProductInDTO, [
  'name',
] as const) { }

export class UpdateProductDTO extends PickType(CreateProductInDTO, [
  'name',
] as const) { }

export class UpsertProductDTO extends CreateProductDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}
export class UpsertProductByIdDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

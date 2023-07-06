import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { UpsertProductDTO } from '@modules/product/dtos/product.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateSupplierInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  cif: string;

  @IsString()
  @IsNotEmpty()
  rc: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  bankIban: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => UpsertProductDTO)
  products: UpsertProductDTO[];
}

export class CreateSupplierDTO extends PickType(CreateSupplierInDTO, [
  'address',
  'bankName',
  'bankIban',
  'cif',
  'email',
  'name',
  'phoneNumber',
  'rc',
  'products'
] as const) { }

export class UpdateSupplierDTO extends PickType(CreateSupplierInDTO, [
  'id',
  'address',
  'bankName',
  'bankIban',
  'cif',
  'email',
  'name',
  'phoneNumber',
  'rc',
  'products'
] as const) { }

export class UpsertSupplierDTO extends CreateSupplierDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class UpsertSupplierByIdDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

import { PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateSupplierInDTO implements Prisma.SupplierCreateInput {
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

  @IsString()
  @IsNotEmpty()
  products: string;
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

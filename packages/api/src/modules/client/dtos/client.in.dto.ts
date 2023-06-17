import { PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateClientInDTO implements Prisma.ClientCreateInput {
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
}

export class CreateClientDTO extends PickType(CreateClientInDTO, [
  'address',
  'bankName',
  'bankIban',
  'cif',
  'email',
  'name',
  'phoneNumber',
  'rc',
] as const) { }

export class UpdateClientDTO extends PickType(CreateClientInDTO, [
  'id',
  'address',
  'bankName',
  'bankIban',
  'cif',
  'email',
  'name',
  'phoneNumber',
  'rc',
] as const) { }

export class UpsertClientDTO extends CreateClientDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

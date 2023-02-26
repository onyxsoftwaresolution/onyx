import { PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateEmployeeInDTO implements Prisma.EmployeeCreateInput {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;
}

export class CreateEmployeeDTO extends PickType(CreateEmployeeInDTO, [
  'name',
  'position',
] as const) {}

export class UpdateEmployeeDTO extends PickType(CreateEmployeeInDTO, [
  'id',
  'name',
  'position',
] as const) {}

export class UpsertEmployeeDTO extends CreateEmployeeDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

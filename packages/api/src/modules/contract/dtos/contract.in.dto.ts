import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { UpsertClientDTO } from '@modules/client/dtos/client.in.dto';
import { UpsertSupplierByIdDTO } from '@modules/supplier/dtos/supplier.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateContractInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsDateString()
  @IsNotEmpty()
  start: string | Date;

  @IsDateString()
  @IsNotEmpty()
  end: string | Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  representative: string;

  @Type(() => UpsertClientDTO)
  client: UpsertClientDTO;
}

export class CreateContractDTO extends PickType(CreateContractInDTO, [
  'cost',
  'details',
  'start',
  'end',
  'location',
  'representative',
  'number',
  'client',
] as const) { }

export class UpdateContractDTO extends PickType(CreateContractInDTO, [
  'cost',
  'details',
  'start',
  'end',
  'location',
  'representative',
  'number',
  'client',
] as const) { }

export class UpsertContractDTO extends CreateContractDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

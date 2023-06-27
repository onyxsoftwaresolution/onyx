import { UpsertClientDTO } from '@modules/client/dtos/client.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

class CreateContractInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  created?: string | Date;

  @IsInt()
  @IsNotEmpty()
  modified?: string | Date;

  @IsInt()
  @IsNotEmpty()
  deleted?: boolean;

  @IsInt()
  @IsNotEmpty()
  number: string;

  @IsInt()
  @IsNotEmpty()
  cost: number;

  @IsInt()
  @IsNotEmpty()
  start: string | Date;

  @IsInt()
  @IsNotEmpty()
  end: string | Date;

  @IsInt()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsNotEmpty()
  details: string;

  @IsInt()
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
  'id',
  'cost',
  'details',
  'start',
  'end',
  'location',
  'representative',
  'number',
] as const) { }

export class UpsertContractDTO extends CreateContractDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

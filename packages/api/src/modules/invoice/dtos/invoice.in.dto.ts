import { UpsertProjectDTO } from '@modules/project/dtos/project.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateInvoiceInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  number: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: Date | string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date | string;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  @Type(() => UpsertProjectDTO)
  project: UpsertProjectDTO;
}

export class CreateInvoiceDTO extends PickType(CreateInvoiceInDTO, [
  'number',
  'issueDate',
  'dueDate',
  'projectId',
] as const) { }

export class UpdateInvoiceDTO extends PickType(CreateInvoiceInDTO, [
  'id',
  'number',
  'issueDate',
  'dueDate',
  'projectId',
] as const) { }

export class UpsertInvoiceDTO extends CreateInvoiceDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class UpsertInvoiceByIdDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

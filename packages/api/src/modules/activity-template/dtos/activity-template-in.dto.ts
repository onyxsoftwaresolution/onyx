import { EntityInDTO } from '@common/dtos/entity.in.dto';
import { ActivityTemplate } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PickType, PartialType, IntersectionType } from '@nestjs/swagger';

export class ActivityTemplateInDTO
  extends EntityInDTO
  implements ActivityTemplate
{
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;
  available: boolean;
}

export class CreateActivityTemplateDTO extends PickType(ActivityTemplateInDTO, [
  'description',
  'cost',
  'material',
] as const) {}

export class UpsertActivityTemplateDTO extends CreateActivityTemplateDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

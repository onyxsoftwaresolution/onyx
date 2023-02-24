import { EntityInDTO } from '@common/dtos/entity.in.dto';
import { ActivityTemplate } from '@prisma/client';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

export class IdActivityTemplateDTO implements Partial<ActivityTemplate> {
  @IsInt()
  @IsNotEmpty()
  id?: number;
}

export class UpsertActivityTemplateDTO extends IntersectionType(
  IdActivityTemplateDTO,
  CreateActivityTemplateDTO,
) {}

import { EntityInDTO } from '@common/dtos/entity.in.dto';
import { ActivityTemplate } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { PickType } from '@nestjs/swagger';

function message(value: string) {
  return (validationArguments: ValidationArguments) => {
    return JSON.stringify({ key: validationArguments.property, value });
  };
}

export class ActivityTemplateInDTO extends EntityInDTO implements ActivityTemplate {
  @IsString({ message: message('Descrierea trebuie sa fie un sir de caractere!') })
  @IsNotEmpty({ message: message('Descrierea trebuie sa fie un sir de caractere!') })
  description: string;

  @IsString({ message: message('Materialul trebuie sa fie un sir de caractere!') })
  @IsNotEmpty({ message: message('Materialul trebuie sa fie un sir de caractere!') })
  material: string;

  @IsNumber({}, { message: message('Costul trebuie sa fie un numar!') })
  @IsNotEmpty({ message: message('Costul trebuie sa fie un numar!') })
  cost: number;
  available: boolean;

  @IsNumber({}, { message: message('Furnizorul nu este valid!') })
  @IsNotEmpty({ message: message('Furnizorul nu este valid!') })
  supplierId: number;

  @IsNumber({}, { message: message('Produsul nu este valid!') })
  @IsNotEmpty({ message: message('Produsul nu este valid!') })
  productId: number;
}

export class CreateActivityTemplateDTO extends PickType(ActivityTemplateInDTO, [
  'description',
  'cost',
  'material',
] as const) { }

export class UpsertActivityTemplateDTO extends CreateActivityTemplateDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

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
import { UpsertSupplierByIdDTO } from '@modules/supplier/dtos/supplier.in.dto';
import { UpsertProductByIdDTO } from '@modules/product/dtos/product.in.dto';
import { Type } from 'class-transformer';

function message(value: string) {
  return (validationArguments: ValidationArguments) => {
    return JSON.stringify({ key: validationArguments.property, value });
  };
}

export class ActivityTemplateInDTO extends EntityInDTO {
  @IsString({ message: message('Descrierea trebuie sa fie un sir de caractere!') })
  @IsNotEmpty({ message: message('Descrierea trebuie sa fie un sir de caractere!') })
  description: string;

  @IsNumber({}, { message: message('Costul trebuie sa fie un numar!') })
  @IsNotEmpty({ message: message('Costul trebuie sa fie un numar!') })
  cost: number;
  available: boolean;

  @IsNotEmpty({ message: message('Furnizorul nu este valid!') })
  @Type(() => UpsertSupplierByIdDTO)
  supplier: UpsertSupplierByIdDTO;

  @IsNotEmpty({ message: message('Produsul nu este valid!') })
  @Type(() => UpsertProductByIdDTO)
  product: UpsertProductByIdDTO;
}

export class CreateActivityTemplateDTO extends PickType(ActivityTemplateInDTO, [
  'description',
  'cost',
  'product',
  'supplier',
] as const) { }

export class UpsertActivityTemplateDTO extends CreateActivityTemplateDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

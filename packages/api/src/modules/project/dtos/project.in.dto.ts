import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { UpsertContractDTO } from '@modules/contract/dtos/contract.in.dto';
import { UpsertEmployeeDTO } from '@modules/employee/dtos/employee.in.dto';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, } from 'class-validator';

export class UpsertProjectDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsDateString()
  @IsNotEmpty()
  start: Date | string;

  @IsDateString()
  @IsNotEmpty()
  end: Date | string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => UpsertProjectActivityDTO)
  projectActivities: UpsertProjectActivityDTO[];

  @Type(() => UpsertEmployeeDTO)
  areaAdmin: UpsertEmployeeDTO;

  @Type(() => UpsertEmployeeDTO)
  localAdmin: UpsertEmployeeDTO;

  @IsOptional()
  @Type(() => UpsertContractDTO)
  contract?: UpsertContractDTO;
}

export class UpsertBasicProjectDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsDateString()
  @IsNotEmpty()
  start: Date | string;

  @IsDateString()
  @IsNotEmpty()
  end: Date | string;
}

export class UpsertProjectActivityDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsInt()
  @IsNotEmpty()
  activityTemplateId: number;

  @IsInt()
  @IsNotEmpty()
  projectId: number;
}

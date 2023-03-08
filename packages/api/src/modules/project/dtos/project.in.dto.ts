import { UpsertEmployeeDTO } from '@modules/employee/dtos/employee.in.dto';
import { Prisma, ProjectActivity } from '@prisma/client';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertProjectDTO {
  @IsInt()
  @IsNotEmpty()
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
  projectActivities: ProjectActivityInDTO[];

  areaAdmin: UpsertEmployeeDTO;

  localAdmin: UpsertEmployeeDTO;
}

export class ProjectActivityInDTO {
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
}

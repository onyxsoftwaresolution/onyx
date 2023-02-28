import { Prisma } from '@prisma/client';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpsertProjectDTO implements Partial<Prisma.ProjectCreateInput> {
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
}

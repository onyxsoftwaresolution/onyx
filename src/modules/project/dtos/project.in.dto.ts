import { Prisma } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateProject implements Prisma.ProjectCreateInput {
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
  start: string;

  @IsDateString()
  @IsNotEmpty()
  end: string;
}

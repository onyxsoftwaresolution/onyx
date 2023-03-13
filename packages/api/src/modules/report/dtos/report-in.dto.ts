import { EntityInDTO } from "@common/dtos/entity.in.dto";
import { Type } from "class-transformer";
import { ProjectReport } from "@prisma/client";
import { IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { IsNonPrimitiveArray } from "@common/validator/IsNonPrimitiveArray";
import { UpsertBasicProjectDTO, UpsertProjectActivityDTO } from "@modules/project/dtos/project.in.dto";

export class UpsertDailyActivityReportDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  todayStock: number;

  @IsInt()
  @IsNotEmpty()
  addedStock: number;

  @IsInt()
  @IsNotEmpty()
  totalStock: number;

  @IsInt()
  @IsNotEmpty()
  noImplToday: number;

  @IsInt()
  @IsNotEmpty()
  finalStockToday: number;

  @IsInt()
  @IsNotEmpty()
  totalImplToday: number;

  @IsInt()
  @IsNotEmpty()
  totalProjectUnits: number;

  @IsInt()
  @IsNotEmpty()
  remainingUnits: number;

  @IsInt()
  @IsOptional()
  dailyProjectActivityId: number;

  @Type(() => UpsertProjectActivityDTO)
  dailyProjectActivity: UpsertProjectActivityDTO;
}

export class UpsertMonthlyActivityReportDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsOptional()
  monthlyNoImplUnits: number;

  @IsNumber()
  @IsOptional()
  monthlyActivityCost: number;

  @IsInt()
  @IsOptional()
  monthlyProjectActivityId: number;

  @Type(() => UpsertProjectActivityDTO)
  monthlyProjectActivity: UpsertProjectActivityDTO;
}

export class UpsertProjectReportDTO {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ValidateNested()
  @Type(() => UpsertBasicProjectDTO)
  project: UpsertBasicProjectDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => UpsertDailyActivityReportDTO)
  dailyActivityReports: UpsertDailyActivityReportDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => UpsertMonthlyActivityReportDTO)
  monthlyActivityReports: UpsertMonthlyActivityReportDTO[];
}

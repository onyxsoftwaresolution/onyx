import { EntityOutDTO } from "@common/dtos/entity.out.dto";
import { Expose, Type } from "class-transformer";
import { ActivityReport, ProjectActivity, ProjectReport } from "@prisma/client";
import { IsArray, ValidateNested } from "class-validator";
import { IsNonPrimitiveArray } from "@common/validator/IsNonPrimitiveArray";
import { ProjectActivityOutDTO, ProjectOutDTO } from "@modules/project/dtos/project.out.dto";

export class ReportListItemOutDTO extends EntityOutDTO {
  @Expose()
  id: number;

  @Expose()
  date: Date;
}

export class ActivityReportOutDTO extends EntityOutDTO implements Partial<ActivityReport> {
  @Expose()
  id?: number;
  @Expose()
  todayStock: number;
  @Expose()
  addedStock: number;
  @Expose()
  totalStock: number;
  @Expose()
  noImplToday: number;
  @Expose()
  finalStockToday: number;
  @Expose()
  totalImplToday: number;
  @Expose()
  totalProjectUnits: number;
  @Expose()
  remainingUnits: number;
  @Expose()
  dailyProjectActivityId: number;
  @Expose()
  @Type(() => ProjectActivityOutDTO)
  dailyProjectActivity: ProjectActivityOutDTO;
  @Expose()
  monthlyProjectActivityId: number;
  @Expose()
  @ValidateNested()
  @Type(() => ProjectActivityOutDTO)
  monthlyProjectActivity: ProjectActivityOutDTO;
  @Expose()
  dailyProjectReportId: number;
  @Expose()
  monthlyProjectReportId: number;
}

export class ProjectReportOutDTO extends EntityOutDTO implements Partial<ProjectReport> {
  @Expose()
  id: number;
  created: Date;
  modified: Date;
  deleted: boolean;
  @Expose()
  projectId: number;
  @Expose()
  date: Date;

  @Expose()
  @IsArray()
  @ValidateNested()
  @Type(() => ProjectOutDTO)
  project: ProjectOutDTO;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => ActivityReportOutDTO)
  dailyActivityReports: ActivityReportOutDTO[];

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => ActivityReportOutDTO)
  monthlyActivityReports: ActivityReportOutDTO[];
}

import { EntityOutDTO } from "@common/dtos/entity.out.dto";
import { Expose } from "class-transformer";
import { ActivityReport } from "@prisma/client";

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
  monthlyProjectActivityId: number;
  @Expose()
  dailyProjectReportId: number;
  @Expose()
  monthlyProjectReportId: number;
}

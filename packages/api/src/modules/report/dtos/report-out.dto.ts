import { EntityOutDTO } from "@common/dtos/entity.out.dto";
import { Expose } from "class-transformer";

export class ReportListItemOutDTO extends EntityOutDTO {
  @Expose()
  id: number;

  @Expose()
  date: Date;
}

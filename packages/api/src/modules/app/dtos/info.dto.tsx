import { EntityOutDTO } from "@common/dtos/entity.out.dto";
import { Expose } from "class-transformer";

export class InfoDTO extends EntityOutDTO {
  @Expose()
  NODE_ENV: string;
  @Expose()
  corsOrigin: string;
}

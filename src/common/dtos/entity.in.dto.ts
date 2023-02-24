import { IsBoolean, IsDate, IsInt, IsNotEmpty } from "class-validator";

export class EntityInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsDate()
  @IsNotEmpty()
  created: Date;

  @IsDate()
  @IsNotEmpty()
  modified: Date;

  @IsBoolean()
  @IsNotEmpty()
  deleted: boolean;
}

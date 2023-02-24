import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Role } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class JwtUserDTO extends EntityOutDTO {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  @Expose()
  role: Role;
}

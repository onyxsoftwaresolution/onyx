import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Role, User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserOutDTO extends EntityOutDTO implements User {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  role: Role;

  password: string;

  @Expose()
  autopass: boolean;

  created: Date;
  modified: Date;
  deleted: boolean;
}

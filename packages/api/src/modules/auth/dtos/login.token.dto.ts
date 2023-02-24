import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { UserOutDTO } from '@modules/user/dtos/user-out.dto';
import { Expose } from 'class-transformer';

export class LoginTokenDTO extends EntityOutDTO {
  @Expose()
  user: UserOutDTO;
  @Expose()
  access_token: string;
}

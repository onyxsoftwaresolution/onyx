import { StringsEnum } from '@common/strings.enum';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: StringsEnum.INVALID_USERNAME })
  @IsNotEmpty({ message: StringsEnum.INVALID_USERNAME })
  username: string;

  @IsString({ message: StringsEnum.INVALID_USERNAME })
  @IsNotEmpty({ message: StringsEnum.INVALID_PASSWORD })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

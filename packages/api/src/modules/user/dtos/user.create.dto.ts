import { StringsEnum } from '@common/strings.enum';
import { Role } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString({ message: StringsEnum.INVALID_USERNAME })
  @IsNotEmpty({ message: StringsEnum.INVALID_USERNAME })
  username: string;

  @IsString({ message: StringsEnum.INVALID_USERNAME })
  @IsNotEmpty({ message: StringsEnum.INVALID_PASSWORD })
  password: string;

  @IsString({ message: StringsEnum.INVALID_USERNAME })
  @IsNotEmpty({ message: StringsEnum.INVALID_PASSWORD })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

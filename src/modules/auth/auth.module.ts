import { Module } from '@nestjs/common';
import { AuthService } from '@modules/auth/service/auth.service';
import { UsersModule } from '@modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@modules/auth/passport/local.strategy';
import { AuthController } from '@modules/auth/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@modules/auth/passport/jwt.strategy';
import { ConfigService } from '@common/config/config.service';
import { PrismaModule } from '@modules/prisma/prisma.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      useFactory(config: ConfigService) {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '1y' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

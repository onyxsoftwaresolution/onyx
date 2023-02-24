import { ConfigModule } from '@common/config/config.module';
import { ActivityTemplateModule } from '@modules/activity-template/activity-template.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/passport/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/rbac/role.guard';
import { EmployeeModule } from '@modules/employee/employee.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { UsersModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UsersModule,
    PrismaModule,
    ActivityTemplateModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // `JwtAuthGuard` will add `user` in request obj
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // `RolesGuard` must be after `JwtAuthGuard`
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

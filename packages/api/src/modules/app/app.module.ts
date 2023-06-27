import { ConfigModule } from '@common/config/config.module';
import { ActivityTemplateModule } from '@modules/activity-template/activity-template.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtAuthGuard } from '@modules/auth/passport/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/rbac/role.guard';
import { EmployeeModule } from '@modules/employee/employee.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ProjectModule } from '@modules/project/project.module';
import { ReportModule } from '@modules/report/report.module';
import { UsersModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppProvider } from './app.provider';
import { ClientModule } from '@modules/client/client.module';
import { SupplierModule } from '@modules/supplier/supplier.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UsersModule,
    PrismaModule,
    ActivityTemplateModule,
    EmployeeModule,
    ClientModule,
    SupplierModule,
    ProjectModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppProvider,
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
export class AppModule { }

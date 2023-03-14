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
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UsersModule,
    PrismaModule,
    ActivityTemplateModule,
    EmployeeModule,
    ProjectModule,
    ReportModule,
    MailerModule.forRoot({
      transport: 'smtps://onyxsoftwaresolution@gmail.com:onyxsoftwaresolution1234@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      // template: {
      //   dir: __dirname + '/templates',
      //   adapter: new PugAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
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
export class AppModule { }

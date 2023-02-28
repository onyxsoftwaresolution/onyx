import { Role } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@modules/app/app.module';
import { bootstrap } from '../src/main';
import { UserService } from '@modules/user/service/user.service';
import { ActivityTemplateService } from '@modules/activity-template/service/activity-template.service';
import { EmployeeService } from '@modules/employee/service/employee.service';
import { ProjectService } from '@modules/project/service/project.service';
import * as dayjs from 'dayjs';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await bootstrap(app);

  // await seedUsers(app);

  // await seedActivityTemplates(app);

  // await seedEmployees(app);

  // await seedProjects(app);

  process.exitCode = 0;
  await app.close();
  process.exit(0);
})();

const seedUsers = async (app: NestExpressApplication) => {
  const userService = app.get<UserService>(UserService);

  const cristina = await userService.upsertInitialUser({
    username: 'cristina',
    password: 'admin',
    role: Role.ADMIN,
  });
  const tase = await userService.upsertInitialUser({
    username: 'tase',
    password: 'admin',
    role: Role.USER,
  });
  console.log('seeded users:', { cristina, tase });
};

const seedActivityTemplates = async (app: NestExpressApplication) => {
  const activityTemplateService = app.get<ActivityTemplateService>(
    ActivityTemplateService,
  );

  const result = [
    await activityTemplateService.createActivityTemplate({
      description:
        'Forare piloti cu diametru si adancime conf. proiect, in terasament',
      material: 'piloti',
      cost: 100,
    }),
    await activityTemplateService.createActivityTemplate({
      description: 'Montare armatura',
      material: 'armatura',
      cost: 100,
    }),
    await activityTemplateService.createActivityTemplate({
      description: 'Fixare stalpi pe pozitie',
      material: 'stalpi',
      cost: 100,
    }),
    await activityTemplateService.createActivityTemplate({
      description: 'Turnare beton (Etapa I)',
      material: 'beton (mc)',
      cost: 100,
    }),
    await activityTemplateService.createActivityTemplate({
      description: 'Asistenta turnare beton (mc)',
      material: 'beton (mc)',
      cost: 100,
    }),
  ];

  console.log('seeded activity templates', result);
};

const seedEmployees = async (app: NestExpressApplication) => {
  const employeeService = app.get<EmployeeService>(EmployeeService);

  const result = [
    await employeeService.createEmployee({
      name: 'Alex Frimitura',
      position: 'muritor de foame',
    }),
    await employeeService.createEmployee({
      name: 'Iulian Strengaru',
      position: 'insufletitor',
    }),
    await employeeService.createEmployee({
      name: 'Marius Militaru',
      position: 'manager',
    }),
    await employeeService.createEmployee({
      name: 'George Pasiute',
      position: 'antreprenor',
    }),
  ];

  console.log('seeded employees', result);
};

// const seedProjects = async (app: NestExpressApplication) => {
//   const projectService = app.get<ProjectService>(ProjectService);

//   const result = [
//     await projectService.createProject({
//       description: 'proj 1',
//       area: 'area 1',
//       code: 'code 1',
//       start: dayjs().toISOString(),
//       end: dayjs().add(1, 'month').toISOString(),
//     }),
//     await projectService.createProject({
//       description: 'proj 2',
//       area: 'area 2',
//       code: 'code 2',
//       start: dayjs().toISOString(),
//       end: dayjs().add(2, 'month').toISOString(),
//     }),
//     await projectService.createProject({
//       description: 'proj 3',
//       area: 'area 3',
//       code: 'code 3',
//       start: dayjs().toISOString(),
//       end: dayjs().add(3, 'month').toISOString(),
//     }),
//   ];

//   console.log('seeded projects', result);
// };

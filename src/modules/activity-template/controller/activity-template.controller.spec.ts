import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTemplateController } from './activity-template.controller';

describe('ActivityController', () => {
  let controller: ActivityTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityTemplateController],
    }).compile();

    controller = module.get<ActivityTemplateController>(
      ActivityTemplateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

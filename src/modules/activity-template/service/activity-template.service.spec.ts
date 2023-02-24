import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTemplateService } from './activity-template.service';

describe('ActivityService', () => {
  let service: ActivityTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityTemplateService],
    }).compile();

    service = module.get<ActivityTemplateService>(ActivityTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

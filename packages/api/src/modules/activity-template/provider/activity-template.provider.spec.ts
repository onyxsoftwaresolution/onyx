import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTemplateProvider } from './activity-template.provider';

describe('ActivityProvider', () => {
  let provider: ActivityTemplateProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityTemplateProvider],
    }).compile();

    provider = module.get<ActivityTemplateProvider>(ActivityTemplateProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

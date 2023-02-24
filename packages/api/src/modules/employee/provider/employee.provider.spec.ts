import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeProvider } from './employee.provider';

describe('Employee', () => {
  let provider: EmployeeProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeProvider],
    }).compile();

    provider = module.get<EmployeeProvider>(EmployeeProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

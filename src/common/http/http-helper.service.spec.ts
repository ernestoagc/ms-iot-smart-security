import { Test, TestingModule } from '@nestjs/testing';
import { HttpHelperService } from './http-helper.service';

describe('HttpHelperService', () => {
  let service: HttpHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpHelperService],
    }).compile();

    service = module.get<HttpHelperService>(HttpHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

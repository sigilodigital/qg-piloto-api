import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionHttpService } from '../exception-http.service';

describe('ExceptionHttpService', () => {
  let service: ExceptionHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionHttpService],
    }).compile();

    service = module.get<ExceptionHttpService>(ExceptionHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

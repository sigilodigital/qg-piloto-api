import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from '../utils.service';
import { UtilService } from '@libs/common/services/util.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService, UtilService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

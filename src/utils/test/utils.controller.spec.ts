import { Test, TestingModule } from '@nestjs/testing';
import { UtilsController } from '../utils.controller';
import { UtilsService } from '../utils.service';
import { UtilService } from '@libs/common/services/util.service';

describe('UtilsController', () => {
  let controller: UtilsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilsController],
      providers: [UtilsService, UtilService],
    }).compile();

    controller = module.get<UtilsController>(UtilsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { MSG } from '@libs/common/services/code-messages';

describe('LocalAuthGuard', () => {
    let localAuth: LocalAuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LocalAuthGuard, MSG]
        }).compile();

        localAuth = module.get<LocalAuthGuard>(LocalAuthGuard);
    });

    it('should be defined', () => {
        expect(localAuth).toBeDefined();
    });
});

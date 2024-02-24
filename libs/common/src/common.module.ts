import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UtilRepository } from './repository/util.repository';
import { UtilService } from './services/util.service';
import { ApiResponse } from './services/response-handler';
import { QUERY_RUNNER_PROVIDER } from './providers/query-runner.provider';

@Module({
    imports: [],
    providers: [
        CommonService,
        UtilService,
        
        UtilRepository,

        ApiResponse,
        QUERY_RUNNER_PROVIDER
    ],
    exports: [
        CommonService,
        UtilService,
        
        UtilRepository,
        
        ApiResponse,
        QUERY_RUNNER_PROVIDER
    ],
})
export class CommonModule { }

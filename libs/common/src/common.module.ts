import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UtilRepository } from './repository/util.repository';
import { UtilService } from './services/util.service';
import { ApiResponse } from './services/response-handler';

@Module({
    imports: [],
    providers: [
        CommonService,
        UtilService,
        
        UtilRepository,

        ApiResponse,
    ],
    exports: [
        CommonService,
        UtilService,
        
        UtilRepository,
        
        ApiResponse,
    ],
})
export class CommonModule { }

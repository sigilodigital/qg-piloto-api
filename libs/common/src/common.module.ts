import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { UtilRepository } from './repository/util.repository';
import { UtilService } from './services/util.service';

@Module({
    imports: [],
    providers: [
        CommonService,
        UtilService,

        UtilRepository,
    ],
    exports: [
        CommonService,
        UtilService,
        
        UtilRepository,
    ],
})
export class CommonModule { }

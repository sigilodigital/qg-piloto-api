import { Module } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaEventListDto } from './models/dto/auditoria-event-list.dto';



@Module({
    providers: [AuditoriaService, AuditoriaEventListDto],
    exports: [AuditoriaService]
})
export class AuditoriaModule { }

import { Module } from '@nestjs/common';
import { InteressadoEntity } from './entities/interessado.entity';
import { InteressadoController } from './interessado.controller';
import { InteressadoService } from './interessado.service';

@Module({
    controllers: [InteressadoController],
    providers: [InteressadoService, InteressadoEntity]
})
export class InteressadoModule { }

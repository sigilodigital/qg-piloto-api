import { Module } from '@nestjs/common';

import { QUERY_RUNNER_PROVIDER } from '@sd-root/libs/common/src/providers/query-runner.provider';
import { AvaliadorRepository } from './repositories/avaliador.repository';
import { AvaliadorController } from './avaliador.controller';
import { AvaliadorService } from './avaliador.service';

@Module({
    controllers: [AvaliadorController],
    providers: [AvaliadorService, AvaliadorRepository, QUERY_RUNNER_PROVIDER],
    exports: [AvaliadorService, AvaliadorRepository, QUERY_RUNNER_PROVIDER]
})
export class AvaliadorModule { }
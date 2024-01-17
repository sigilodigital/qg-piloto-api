import { Module } from '@nestjs/common';
import { SistemaWsService } from './sistema-ws.service';
import { SistemaWsController } from './sistema-ws.controller';

@Module({
  controllers: [SistemaWsController],
  providers: [SistemaWsService]
})
export class SistemaWsModule {}

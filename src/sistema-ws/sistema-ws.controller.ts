import { Controller } from '@nestjs/common';
import { SistemaWsService } from './sistema-ws.service';

@Controller('sistema-ws')
export class SistemaWsController {
  constructor(private readonly sistemaWsService: SistemaWsService) {}
}

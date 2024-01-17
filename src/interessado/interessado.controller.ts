import { Controller } from '@nestjs/common';
import { InteressadoService } from './interessado.service';

@Controller('interessado')
export class InteressadoController {
  constructor(private readonly interessadoService: InteressadoService) {}
}

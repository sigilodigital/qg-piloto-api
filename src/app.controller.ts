import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ description: 'Obter mensagem de boas-vindas' })
  @ApiResponse({ status: 200, description: 'Mensagem de boas-vindas retornada' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

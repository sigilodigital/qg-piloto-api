import { Test, TestingModule } from '@nestjs/testing';

import { AvaliadorConsultarInputDto, AvaliadorConsultarOutputDto } from '../models/dto/avaliador-consultar/avaliador-consultar.dto';
import { AvaliadorRepository } from '../repositories/avaliador.repository';
import { AvaliadorService } from '../avaliador.service';

describe('AvaliadorService', () => {
    let service: AvaliadorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AvaliadorService],
        }).compile();

        service = module.get<AvaliadorService>(AvaliadorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('avaliadorConsultar: deve retornar uma lista de avaliadores', async () => {
        const input: AvaliadorConsultarInputDto = { isActive: true };
        const result = await service.avaliadorConsultar(input);
        expect(result).toBeInstanceOf(Array<AvaliadorConsultarOutputDto>);
    });

});

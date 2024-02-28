import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');

import { MSG } from '@libs/common/services/code-messages';
import { IApiResponseHandler } from '@libs/common/services/response-handler';
import { AppModule } from '@sd-root/src/app.module';
import { AvaliadorConsultarInputDto } from 'src/features/avaliador/models/dto/avaliador-consultar.dto';
import { AvaliadorEntity } from 'src/features/avaliador/models/entities/avaliador.entity';

type R<T = AvaliadorEntity[]> = request.Test & { body: IApiResponseHandler<any, T>; };

describe('UC: Consultar avaliador', () => {
    let app: INestApplication;
    let config: { urn: string; };

    beforeAll(async () => {
        config = { urn: '/avaliador/consultar' };
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeEach(async () => { });

    it('deve retornar todos os avaliadores', async () => {
        const user: AvaliadorConsultarInputDto = {};
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
        expect(body.data?.length).toBeGreaterThanOrEqual(1);
    });

    it('deve retornar todos os avaliadores ativos', async () => {
        const user: AvaliadorConsultarInputDto = { isActive: true };
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
        expect(body.data?.length).toBeGreaterThanOrEqual(1);
    });

    it('deve retornar todos os avaliadores inativos', async () => {
        const user: AvaliadorConsultarInputDto = { isActive: false };
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
        expect(body.data?.length).toEqual(0);
    });

    describe('Validação de tipo', () => {

        it('cpf: deve retornar todos os avaliadores inativos', async () => {
            const user: AvaliadorConsultarInputDto = { isActive: false };
            const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

            expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
            expect(body.data?.length).toEqual(0);
        });
    });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');

import { MSG } from '@libs/common/services/code-messages';
import { IApiResponseHandler } from '@libs/common/services/response-handler';
import { AppModule } from '@sd-root/src/app.module';
import { UsuarioConsultarInputDto } from 'src/features/usuario/models/dto/usuario-consultar.dto';
import { UsuarioEntity } from 'src/features/usuario/models/entities/usuario.entity';

type R<T = UsuarioEntity[]> = request.Test & { body: IApiResponseHandler<any, T>; };

describe('UC: Consultar usuário', () => {
    let app: INestApplication;
    let config: { urn: string; };

    beforeAll(async () => {
        config = { urn: '/usuario/consultar' };
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeEach(async () => { });

    it('deve retornar todos os usuários', async () => {
        const user: UsuarioConsultarInputDto = {};
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
        expect(body.data?.length).toBeGreaterThanOrEqual(1);
    });

    it('deve retornar todos os usuários ativos', async () => {
        const user: UsuarioConsultarInputDto = { isActive: true };
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
        expect(body.data?.length).toBeGreaterThanOrEqual(1);
    });

    it('deve retornar todos os usuários inativos', async () => {
        const user: UsuarioConsultarInputDto = { isActive: false };
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
        expect(body.data?.length).toEqual(0);
    });

    describe('Validação de tipo', () => {

        it('cpf: deve retornar todos os usuários inativos', async () => {
            const user: UsuarioConsultarInputDto = { isActive: false };
            const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(user);

            expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
            expect(body.data?.length).toEqual(0);
        });
    });
});

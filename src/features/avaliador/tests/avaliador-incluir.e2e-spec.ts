import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request = require('supertest');

import { MSG } from '@libs/common/services/api-messages';
import { IApiResponseHandler } from '@libs/common/services/api-response';
import { ContatoInputDto } from '@sd-root/libs/common/src/models/dto/contato/contato.dto';
import { EmailInputDto } from '@sd-root/libs/common/src/models/dto/contato/email.dto';
import { EnderecoInputDto } from '@sd-root/libs/common/src/models/dto/contato/endereco.dto';
import { TelefoneInputDto } from '@sd-root/libs/common/src/models/dto/contato/telefone.dto';
import { getRandomInt } from '@sd-root/libs/common/src/utils';
import { AppModule } from '@sd-root/src/app.module';
import { AvaliadorEntity } from 'src/features/avaliador/models/entities/avaliador.entity';
import { UsuarioConsultarInputDto } from '../../usuario/models/dto/usuario-consultar.dto';
import { UsuarioEntity } from '../../usuario/models/entities/usuario.entity';
import { UsuarioRepository } from '../../usuario/repositories/usuario.repository';
import { AvaliadorDocumentacaoIncluirInputDto } from '../models/dto/avaliador-incluir/avaliador-documentacao-incluir.dto';
import { AvaliadorIncluirInputDto } from '../models/dto/avaliador-incluir/avaliador-incluir.dto';

type R<T = AvaliadorEntity> = request.Test & { body: IApiResponseHandler<any, T>; };
type R2<T = AvaliadorEntity[]> = request.Test & { body: IApiResponseHandler<any, T>; };

describe('UC: Incluir avaliador', () => {
    let app: INestApplication;
    let config: { urn: string; };

    beforeAll(async () => {
        config = { urn: '/avaliador/incluir' };
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

    });

    beforeEach(async () => { });

    jest.setTimeout(120000);
    it('deve incluir um novo avaliador', async () => {

        const avaliador: AvaliadorIncluirInputDto = await AvaliadorIncluirInputDtoTest.getObject();
        const { body } = <R><unknown>await request(app.getHttpServer()).post(config.urn).send(avaliador);

        expect(body.status?.statusCode).toEqual(MSG.DEFAULT_SUCESSO.code);
    });

});

class DependencyTest {
    static async getUser(input: UsuarioConsultarInputDto = {}): Promise<UsuarioEntity> {
        const uRepo = new UsuarioRepository();
        return await uRepo.findOneBy(input);
    }
}

class AvaliadorIncluirInputDtoTest {
    public static async getObject(input: Partial<AvaliadorIncluirInputDto> = {}): Promise<AvaliadorIncluirInputDto> {
        const obj = {
            nacionalidade: input.nacionalidade ?? 'Brasileira??',
            naturalidade: input.naturalidade ?? '??Brasil',
            nomeMae: input.nomeMae ?? 'Mar??ia',
            nomePai: input.nomePai ?? 'João',
            instituicaoNome: input.instituicaoNome ?? '??',
            _instituicaoContato: ContatoInputDtoTest.getObject(),
            _documentacao: AvaliadorDocumentacaoIncluirInputDtoTest.getObject({} as AvaliadorDocumentacaoIncluirInputDto),
            _usuario: await DependencyTest.getUser(),
            isActive: true,
        };
        return PropertyTest.setValue(obj);
    }
}

class ContatoInputDtoTest {
    public static getObject(obj: Partial<ContatoInputDto> = {}): ContatoInputDto {
        return {
            _emailList: [
                EmailInputDtoTest.getObject({} as EmailInputDto),
            ],
            _telefoneList: [
                TelefoneInputDtoTest.getObject({} as TelefoneInputDto),
            ],
            _enderecoList: [
                EnderecoInputDtoTest.getObject({} as EnderecoInputDto),
            ],
        };
    }

}

class PropertyTest {

    static setValue(entrada: Object) {
        const obj: any = {};
        if (entrada) {
            Object.keys(entrada).forEach((property) => {
                const value: string = entrada[property];
                switch (typeof value) {
                    case 'object':
                        obj[property] = (value && Array.isArray(value))
                            ? PropertyTest.setValue(value)
                            : value;
                        break;
                    case 'string':
                        const textMatch = '??'
                        obj[property] = value.replaceAll(textMatch, (_, __, input) => {
                            const val = '{' + randomUUID().slice(-5) + '}';
                            return input.length === textMatch.length ? property + val : val;
                        });
                        break;
                    case 'number':
                        obj[property] = (value)
                            ? (<string>value)?.toString().replaceAll(/\d/g, () => {
                                return getRandomInt(1, 9).toString();
                            })
                            : getRandomInt(2, 9).toString();
                        break;
                    // case 'bigint':
                    // case 'boolean':
                    // case 'function':
                    // case 'symbol':
                    // case 'undefined':
                    default:
                        obj[property] = value;
                        break;
                }
            });
        }
        return obj;
    }
}

class EmailInputDtoTest {
    public static getObject(input: Partial<EmailInputDto> = {}): EmailInputDto {
        const obj: EmailInputDto = {
            address: input.address ?? 'email@email.com',
            description: input.address ?? '??',
        };
        return PropertyTest.setValue(obj);
    }

}

class TelefoneInputDtoTest {
    public static getObject(input: TelefoneInputDto): TelefoneInputDto {
        const obj: TelefoneInputDto = {
            number: input.number ?? '123456789012',
            description: input.description ?? '??',
        };
        return PropertyTest.setValue(obj);
    }
}

class EnderecoInputDtoTest {
    public static getObject(input: EnderecoInputDto): EnderecoInputDto {
        const obj: EnderecoInputDto = {
            zipCode: input.zipCode ?? 1,
            country: input.country ?? 'Brasil??',
            state: input.state ?? '??Estado',
            city: input.city ?? 'Cid??ade',
            place: input.place ?? '??',
            number: input.number ?? 'nu??mb??er',
            complement: input.complement ?? '??Co??mp??le??men??to',
            description: input.description ?? 'Casa',
        };
        return PropertyTest.setValue(obj);
    }
}

class AvaliadorDocumentacaoIncluirInputDtoTest {
    public static getObject(input: AvaliadorDocumentacaoIncluirInputDto): AvaliadorDocumentacaoIncluirInputDto {
        const obj: AvaliadorDocumentacaoIncluirInputDto = {
            bancoNome: input.bancoNome ?? '??',
            bancoAgencia: input.bancoAgencia ?? '??',
            bancoContaNumero: input.bancoContaNumero ?? '??',
            bancoContaDigito: input.bancoContaDigito ?? '??',
            identNumero: input.identNumero ?? '??',
            identOrgaoExpedidor: input.identOrgaoExpedidor ?? '??',
            identDtExpedicao: input.identDtExpedicao ?? new Date(),
            nit_pis_pasep: input.nit_pis_pasep ?? '??',
            seExpCoordCursoES: false,
            seExpAvalES: false,
            seExpDocenciaES: false,
            seExpEADTutDoc: false
        };
        return PropertyTest.setValue(obj);
    }
}

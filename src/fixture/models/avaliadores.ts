import { AvaliadorEntity } from "../../features/avaliador/models/entities/avaliador.entity";

import { userList } from "./users";

export const avaliadorList: AvaliadorEntity[] = [
    {
        nacionalidade: 'Brasileiro',
        naturalidade: 'São Paulo',
        _instituicaoContato: {
            _emailList: [{ address: 'avaliador1@sigilo.digital' }, { address: 'avaliador2@sigilo.digital' }],
            _enderecoList: [
                { place: 'Rua dos Programadores', number: '42', description: 'Apartamento 101' },
                { place: 'Avenida das Árvores', number: '500', description: 'Casa' },
                { place: 'Travessa dos Artistas', number: '13', description: 'Estúdio' },
                { place: 'Beco do Code', number: '7', description: 'Escritório' }
            ],
            _telefoneList: [{ number: '63984589691', description: 'Uma descrição aqui' }]
        },
        _usuario: userList[0],
        isActive: true,
        _documentacao: {
            urlCurriculum: 'https://sigilo.digital',
            identNumero: '1234',
            identDtExpedicao: new Date(),
            identOrgaoExpedidor: 'SSP-TO',
            nit_pis_pasep: 'asdf',
            bancoNome: 'Banco Digital',
            bancoAgencia: '321',
            bancoContaNumero: '123',
            bancoContaDigito: '1',
            seExpCoordCursoES: false,
            seExpAvalES: false,
            seExpDocenciaES: false,
            seExpEADTutDoc: false
        }
    }, {
        nacionalidade: 'Brasileiro',
        naturalidade: 'São Paulo',
        _instituicaoContato: {
            _emailList: [{ address: 'avaliador1@sigilo.digital' }, { address: 'avaliador2@sigilo.digital' }],
            _enderecoList: [
                { place: 'Rua dos Programadores', number: '42', description: 'Apartamento 101' },
                { place: 'Avenida das Árvores', number: '500', description: 'Casa' },
                { place: 'Travessa dos Artistas', number: '13', description: 'Estúdio' },
                { place: 'Beco do Code', number: '7', description: 'Escritório' }
            ],
            _telefoneList: [{ number: '63984589691', description: 'Uma descrição aqui' }]
        },
        _usuario: userList[1],
        isActive: false,
        _documentacao: {
            urlCurriculum: 'https://sigilo.digital',
            identNumero: '5678',
            identDtExpedicao: new Date(),
            identOrgaoExpedidor: 'SSP-TO',
            nit_pis_pasep: 'asdf',
            bancoNome: 'Banco Digital',
            bancoAgencia: '321',
            bancoContaNumero: '123',
            bancoContaDigito: '1',
            seExpCoordCursoES: false,
            seExpAvalES: false,
            seExpDocenciaES: false,
            seExpEADTutDoc: false
        }
    }
];
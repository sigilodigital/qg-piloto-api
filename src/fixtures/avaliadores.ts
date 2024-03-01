import { UsuarioEntity } from "src/features/usuario/models/entities/usuario.entity";
import { AvaliadorEntity } from "../features/avaliador/models/entities/avaliador.entity";

import {userList} from "./users"

export const avaliadorList: AvaliadorEntity[] = [
    {
        nacionalidade: 'Brasileiro',
        naturalidade: 'São Paulo',
        _instituicaoContato: {
            _emailList: [{ address: 'ricardo1@dias.com' }, { address: 'ricardo2@dias.com' }],
            _enderecoList: [
                { place: 'Rua dos Programadores', number: '42', description: 'Apartamento 101' },
                { place: 'Avenida das Árvores', number: '500', description: 'Casa' },
                { place: 'Travessa dos Artistas', number: '13', description: 'Estúdio' },
                { place: 'Beco do Code', number: '7', description: 'Escritório' }
            ],
            _telefoneList: [{ number: 'ricardo1@dias.com', description: 'Uma descrição aqui' }]
        },
        _usuario: userList[0],
        isActive: true,
    }
];
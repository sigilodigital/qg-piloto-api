import { UsuarioEntity } from "src/usuario/models/entities/usuario.entity";

const usuario: UsuarioEntity[] = [
    {
        fullname: 'Ricardo Dias',
        cpf: 12345678901,
        _contato: {
            _emailList: [{ address: 'ricardo1@dias.com' }, { address: 'ricardo2@dias.com' }],
            _enderecoList: [
                { place: 'Rua dos Programadores', number: '42', description: 'Apartamento 101' },
                { place: 'Avenida das Árvores', number: '500', description: 'Casa' },
                { place: 'Travessa dos Artistas', number: '13', description: 'Estúdio' },
                { place: 'Beco do Code', number: '7', description: 'Escritório' }
            ],
            _telefoneList: [{ number: 'ricardo1@dias.com', description: 'Uma descrição aqui' }]
        },
        // _contato: contato1,
        password: 'abcd1234',
        isActive: true,
    }
];

export default { usuario }
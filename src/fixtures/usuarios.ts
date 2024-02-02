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
        isActive: true,
    }, {
        fullname: 'Ana Silva',
        cpf: 98765432109,
        _contato: {
            _emailList: [{ address: 'ana.silva@example.com' }],
            _enderecoList: [
                { place: 'Alameda dos Anjos', number: '1000', description: 'Casa' }
            ],
            _telefoneList: [{ number: '11999887766', description: 'Celular pessoal' }]
        },
        isActive: true,
    },
    {
        fullname: 'Carlos Pereira',
        cpf: 11223344556,
        _contato: {
            _emailList: [{ address: 'carlos.p@example.com' }],
            _enderecoList: [
                { place: 'Praça da Árvore', number: '321', description: 'Escritório' }
            ],
            _telefoneList: [{ number: '21988776655', description: 'Telefone comercial' }]
        },
        isActive: false,

    }
];

export default { usuario };
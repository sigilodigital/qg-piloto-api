import { SistemaEntity } from "../core/auth/models/entities/sistema.entity";

export const systemList: SistemaEntity[] = [

    {
        name: 'SD-Portal',
        isActive: true,
        description: 'Sistema para gestão de portais',
        username: 'sd-portal',
        password: '$2a$10$sU8WdC5ggk02VlMTJ41lWuXx/dUpaKywTMRLg7sDJ/qO0MGTAmDD.', //abcd1234
        _metodoList: [
            {
                name: 'usuario-autenticar',
                description: 'Verifica autenticidade dos usuários do sistema',
                isActive: true,
            },
            {
                name: 'sistema-autenticar',
                description: 'Verifica autenticidade dos sistemas cliente',
                isActive: true,
            },
            {
                name: 'usuario-listar',
                description: 'Retorna uma lista filtrada de usuários',
                isActive: true,
            }
        ]
    },
    {
        name: 'SD-Interno',
        isActive: false,
        description: 'Sistema interno de gerenciamento',
        username: 'sd-interno',
        password: '$2a$10$sU8WdC5ggk02VlMTJ41lWuXx/dUpaKywTMRLg7sDJ/qO0MGTAmDD.' //abcd1234
    },
    {
        name: 'SD-Cliente',
        isActive: true,
        description: 'Sistema de gerenciamento de clientes',
        username: 'sd-cliente',
        password: '$2a$10$sU8WdC5ggk02VlMTJ41lWuXx/dUpaKywTMRLg7sDJ/qO0MGTAmDD.' //abcd1234
    },
];
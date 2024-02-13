import { MetodoEntity } from "../core/auth/models/entities/metodo.entity";

export const methodList: MetodoEntity[] = [

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
    },
];
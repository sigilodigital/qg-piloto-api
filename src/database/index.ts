import { SistemaMetodoDto } from "src/sistema-ws/dto/sistemaMetodoWs.dto";
import { SegSistemaWsDto } from "src/sistema-ws/dto/sistemaWs.dto";
import { CodigoVerificacaoEntity } from "src/codigo-verificacao/entities/codigo-verificacao.entity";
import configurations from "src/config/configurations";
import { InteressadoEntity } from "src/interessado/entities/interessado.entity";
import { UsuarioExterno } from "src/usuario-externo/entities/usuario-externo.entity";
import { DataSource } from "typeorm";
import { SegMetodoWsDto } from "src/sistema-ws/dto/segMetodoWs";
import { PerguntaSecreta } from "src/recuperacao-senha/entities/pergunta-secreta.entity";
import { SegSistemaWs } from "src/auth/entities/segSistemaWs";
import { SegMetodoWs } from "src/auth/entities/segMetodoWs";

export const AppDataSource = new DataSource({
    //Todo corrigir a cobertura das credecias de banco
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: 'piloto',//configurations().database.username,
    password: 'piloto123',
    database: 'piloto',
    synchronize: true,
});

AppDataSource.initialize()
    .then(() => {
        console.warn("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    })



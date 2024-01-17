// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AppDataSource } from 'src/database';
// import { InteressadoService } from 'src/interessado/interessado.service';
// import { IAPIResponse } from '@libs/common/services/response-handler';
// import { decrypt, encrypt } from 'src/shared/utils';
// import { DataSource } from 'typeorm';
// import { ApiResponse } from './../shared/response-handler';
// import { ISistemaMensagemFilaCreate, SistemaMensagemFilaService } from './../sistema-mensagem-fila/sistema-mensagem-fila.service';
// import { UsuarioExterno } from './../usuario-externo/entities/usuario-externo.entity';
// import { UsuarioExternoService } from './../usuario-externo/usuario-externo.service';
// import { ILoginPessoa } from './dto/loginUser.dto';

// @Injectable()
// export class AuthLocalService implements IAuthLocalService {
//     constructor(
//         private jwtService: JwtService,
//         private interessadoService: InteressadoService,
//         private usuarioExternoService: UsuarioExternoService,
//         private sistemaMensagemFilaService: SistemaMensagemFilaService,
//         private dataSource: DataSource
//     ) { }
//     sistema: ISistema;
//     pessoa: any;
//     sistemaMetodo: ISistemaMetodo[];
//     codInteressado: number;
//     txtInteressado: string;
//     className = "AuthService";

//     async validarSistema(input: ILoginSistema['input']): Promise<IAPIResponse<ILoginSistema['output']>> {
//         const methodName = "async validarSistema(input: ILoginSistema['input']): Promise<IAPIResponse<ILoginSistema['output']>>";

//         let sql = `
//             SELECT * FROM IUSR_PROTON.TBL_SEG_SISTEMA_WS tssw
//             WHERE TXT_LOGIN = '${input.txtLogin}'
//         `;
//         const querySistema = await AppDataSource.manager.query(sql);
//         if (querySistema.length > 0) {
//             const sistemaResult = {
//                 codSegSistemaWs: querySistema[0]['COD_SEG_SISTEMA_WS'],
//                 txtSegSistemaWs: querySistema[0]['TXT_SEG_SISTEMA_WS'],
//                 txtLogin: querySistema[0]['TXT_LOGIN'],
//                 txtDescricao: querySistema[0]['TXT_DESCRICAO'],
//                 codAtivo: querySistema[0]['COD_ATIVO']
//             };

//             if (sistemaResult.codAtivo === 0) {
//                 throw new HttpException(ApiResponse.handler({
//                     codNumber: 7,
//                     objEntrada: input
//                 }), HttpStatus.FORBIDDEN);
//             }

//             // Decrypt
//             if (await decrypt(input.txtSenha, querySistema[0]['TXT_SENHA'])) {
//                 this.sistema = sistemaResult;
//                 sql = `
//                     SELECT * FROM IUSR_PROTON.TBL_SEG_SISTEMA_METODO_WS tssmw
//                     WHERE COD_SEG_SISTEMA_WS = '${sistemaResult.codSegSistemaWs}'
//                 `;

//                 const querySistemaMetodo = await AppDataSource.manager.query(sql);
//                 const smList = [];
//                 if (querySistemaMetodo.length > 0) {
//                     for (let i = 0; i < querySistemaMetodo.length; i++) {
//                         const sm = querySistemaMetodo[i];

//                         const sistemaMetodoObj = {
//                             codSegSistemaWs: sm['COD_SEG_SISTEMA_WS'],
//                             codSegMetodoWs: sm['COD_SEG_METODO_WS']
//                         };
//                         smList.push(sistemaMetodoObj);
//                     }

//                     this.sistemaMetodo = smList;

//                     return ApiResponse.handler({
//                         codNumber: 15,
//                         objEntrada: input,
//                         objSaida: {
//                             sistema: sistemaResult,
//                             sistemaMetodo: smList
//                         }
//                     });
//                 } else {
//                     return ApiResponse.handler({
//                         codNumber: 15,
//                         objEntrada: input,
//                         objSaida: {
//                             sistema: sistemaResult
//                         }
//                     });
//                 }
//             } else {
//                 //TODO# SENHA INCORRETA
//                 throw new HttpException(ApiResponse.handler({
//                     codNumber: 6,
//                     objSaidaErro: {
//                         message: 'Senha não confere.',
//                         context: {
//                             input: input,
//                             output: {
//                                 className: this.className,
//                                 methodName: methodName,
//                             }
//                         }
//                     }
//                 }), HttpStatus.FORBIDDEN);
//             }
//         } else {
//             //TODO# SISTEMA NÃO ENCONTRADO
//             throw new HttpException(ApiResponse.handler({
//                 codNumber: 5,
//                 // objEntrada: input,
//                 // objSaida: null,
//                 // property: 'username',
//                 // valueArg: input.txtLogin
//             }), HttpStatus.FORBIDDEN);
//         }
//     }

//     async loginSistema(): Promise<{ access_token: string; }> {
//         const payload = {
//             sistema: this.sistema,
//             sistemaMetodo: this.sistemaMetodo
//         };
//         const token = this.jwtService.sign(payload);

//         return { access_token: token };
//     }

//     async getToken(): Promise<string> {
//         const payload = { user: this.pessoa };
//         const token = this.jwtService.sign(payload);

//         return token;
//     }

// }

// interface IAuthLocalService {
//     validarSistema(input: ILoginSistema['input']): Promise<IAPIResponse<ILoginSistema['output']>>;
//     validarUsuario(input: ILoginPessoaFisica['input']): Promise<IAPIResponse<ILoginPessoaFisica['output']>>;
// }

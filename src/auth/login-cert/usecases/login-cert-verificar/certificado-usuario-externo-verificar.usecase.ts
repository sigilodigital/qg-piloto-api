
import { HttpException, HttpStatus } from '@nestjs/common';
import { ILoginPessoa } from 'src/auth/dto/loginUser.dto';
import { IAuthRepository } from 'src/auth/repository/auth-repository';
import { InteressadoEntity } from 'src/interessado/entities/interessado.entity';
import { ApiResponse } from '@libs/common/services/response-handler';
import { UsuarioExterno } from 'src/usuario-externo/entities/usuario-externo.entity';

type PessoaType = UsuarioExterno & InteressadoEntity;

export class CertificadoUsuarioExternoVerificarUseCase {

    constructor(private authRepository: IAuthRepository) { }

    public async handle(txtCnpjCpf: string) {
        let pessoa: PessoaType;
        try {
            pessoa = await this.authRepository.findByCnpjCpf(txtCnpjCpf);
        } catch (error) {
            fnCatchError(error);
        }

        // this.seNaoUsuarioException(pessoa);
        // this.seInativoException(pessoa);
        // this.seSenhaBloqueadaException(pessoa);

        return (pessoa) ? this.extrairSomenteDadosDeLogin(pessoa) : null;
    }

    private extrairSomenteDadosDeLogin(pessoa: PessoaType) {
        const usuarioExternoLogado: ILoginPessoa['output'] = {
            codUsuarioExterno: pessoa.codUsuarioExterno,
            codInteressado: pessoa.codInteressado,
            txtInteressado: pessoa.txtInteressado,
            txtCnpjCpf: pessoa.txtCnpjCpf,
        };
        return usuarioExternoLogado;
    }

    // private seNaoUsuarioException(pessoa: PessoaType) {
    //     if (!pessoa) {
    //         throw new HttpException(ApiResponse.handler({
    //             codNumber: 9
    //         }), HttpStatus.UNAUTHORIZED);
    //     }
    // }

    // private seInativoException(usuarioExterno: PessoaType) {
    //     if (usuarioExterno.codAtivo === 0) {
    //         throw new HttpException(ApiResponse.handler({
    //             codNumber: 45
    //         }), HttpStatus.UNAUTHORIZED);
    //     }
    // }

    // private seSenhaBloqueadaException(usuarioExterno: PessoaType) {
    //     if (usuarioExterno.codSenhaBloqueada === 1) {
    //         throw new HttpException(ApiResponse.handler({
    //             codNumber: 42
    //         }), HttpStatus.UNAUTHORIZED);
    //     }
    // }

}

function fnCatchError(error) {
    throw new HttpException(ApiResponse.handler({
        codNumber: 60,
    }), HttpStatus.UNAUTHORIZED);
}
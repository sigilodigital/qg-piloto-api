
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginUserInputDto } from 'src/auth/models/dto/login-user.dto';
import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler-v1';
import { IUtilRepository } from '@libs/common/repository/util.repository';
import { UsuarioEntity } from 'src/usuario/models/entities/usuario.entity';

type PessoaType = UsuarioEntity;

export class CertificadoUsuarioExternoVerificarUseCase {

    constructor(private authRepository: IUtilRepository) { }

    public async handle(txtCnpjCpf: string) {
        let pessoa: PessoaType;
        // try {
        //     pessoa = await this.authRepository.findByCnpjCpf(txtCnpjCpf);
        // } catch (error) {
        //     fnCatchError(error);
        // }

        // this.seNaoUsuarioException(pessoa);
        // this.seInativoException(pessoa);
        // this.seSenhaBloqueadaException(pessoa);

        return (pessoa) ? this.extrairSomenteDadosDeLogin(pessoa) : null;
    }

    private extrairSomenteDadosDeLogin(pessoa: PessoaType) {
        const usuarioExternoLogado: any = { //!ALTERADO
            // codUsuarioExterno: pessoa.codUsuarioExterno,
            // codInteressado: pessoa.codInteressado,
            // txtInteressado: pessoa.txtInteressado,
            // txtCnpjCpf: pessoa.txtCnpjCpf,
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
        codMessage: 60,
    }), HttpStatus.UNAUTHORIZED);
}
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Schemas } from 'src/shared/schemas/schemas';
import { AppDataSource } from 'src/database';
import { UsuarioExterno } from 'src/usuario-externo/entities/usuario-externo.entity';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';
import { HttpStatus } from '@nestjs/common';


@ValidatorConstraint({ name: 'ValidaPerguntaSecretaObrigatoria', async: true })
export class ValidaPerguntaSecretaObrigatoria implements ValidatorConstraintInterface {
    private codMessage: number;
    className = "ValidaPerguntaSecretaObrigatoria";

    async validate(text: string, args: ValidationArguments) {
        if (text == undefined) {
            return true;
        } else {
            if (text.length == undefined) {
                return true;
            }
            if (args.property['codInteressado']) {
                const usuarioExterno = await AppDataSource.manager.findOne(UsuarioExterno, { where: { codInteressado: args.property['codInteressado'] } });
                if (usuarioExterno) {
                    const schema = (await Schemas.schemaList(args.targetName)).schema;
                    if (usuarioExterno.codTipoLembranca == 1) {
                        const validacao = (schema.options.columns[args.property].nullable == false) && (text.length > 0);
                        if (validacao) {
                            return true;
                        } else {
                            this.codMessage = 1;
                        }
                    } else return true;

                }

            } return false;

        }
    }

    defaultMessage(args: ValidationArguments) {
        const methodName = "defaultMessage(args: ValidationArguments)";
        ExceptionHttpService.createException({
            property: args.property,
            value: args.value,
            statusCode: HttpStatus.BAD_REQUEST,
            errorCode: this.codMessage,
            objError: {
                message: "Validação de campos",
                context: {
                    input: args,
                    output: {
                        className: this.className,
                        methodName: methodName
                    }
                }
            }
        });

        return ``;
    }
}



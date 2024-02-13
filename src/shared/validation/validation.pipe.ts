/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata, HttpStatus, HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiResponse } from '@libs/common/services/response-handler-v1';
import { Schemas } from 'src/shared/schemas/schemas';



@Injectable()
export class ValidationPipe implements PipeTransform<ApiResponse> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        console.log(object)
        const schema = (await Schemas.schemaList(metatype.name)).schema;
        Object.keys(object).forEach((value, i, obj) => {
            if (!schema.options.columns[obj[i]]) {
                throw new HttpException(ApiResponse.handler({
                    codMessage: 42,
                    input: object,
                    property: obj[i],
                    error: {
                        message: 'Campo informado não existe como parâmetro de pesquisa.',
                        context: {
                            input: object,
                            output: {
                                className: "ValidationPipe",
                                methodName: "transform",
                                objectError: {
                                    message: `Verifique o nome do campo ou adicione o campo ${obj[i]} ao ${schema.options.name}Schema`
                                }
                            }
                        }
                    }
                }), HttpStatus.BAD_REQUEST)
            }
        })

        console.log(schema);
        const errors = await validate(object);
        if (errors.length > 0) {
            for (let index = 0; index < errors.length; index++) {
                const element = errors[index];
                const validacao = ApiResponse.handler({
                    codMessage: <number><unknown>Object.values(element.constraints)[index],
                    valueArg: element.value,
                    property: element.property,
                    input: element.constraints,
                    output: undefined,
                    error: {
                        message: "validationPipe",
                        context: {
                            input: element,
                            output: {
                                className: "ValidationPipe",
                                methodName: "transform"
                            }
                        }
                    }
                })

                //return validacao

                throw new HttpException(validacao,
                    400
                )
            }
        }
        return value
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    getNumErro(mensagem: string): number {
        for (let index = 1; index < 100; index++) {
            if (mensagem.indexOf(index.toString()) > 0) {
                return index;
            }
        }
    }

}
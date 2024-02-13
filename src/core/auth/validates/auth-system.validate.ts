import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoginSistemaInputDto } from '../models/dto/loginSistema.dto';

@Injectable()
export class AuthSystemValidate implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        await (new ValidationPipe()).transform(request.body, { type: 'custom', metatype: LoginSistemaInputDto });

        return true;
    }
}
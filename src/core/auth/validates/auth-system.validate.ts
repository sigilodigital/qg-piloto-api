import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { LoginSistemaInputDto } from '../models/dto/login-sistema.dto';

@Injectable()
export class AuthSystemValidate implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        await (new ValidationPipe()).transform(request.body, { type: 'custom', metatype: LoginSistemaInputDto });

        return true;
    }
}
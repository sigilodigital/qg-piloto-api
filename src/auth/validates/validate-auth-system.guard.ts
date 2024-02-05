import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoginSistema } from '../models/dto/loginSistema.dto';

@Injectable()
export class ValidateAuthSystemGuard implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        await (new ValidationPipe()).transform(request.body, { type: 'custom', metatype: LoginSistema });

        return true;
    }
}
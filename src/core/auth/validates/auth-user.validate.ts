import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { LoginUserInputDto } from 'src/core/auth/models/dto/login-user.dto';

@Injectable()
export class AuthUserValidate implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        await (new ValidationPipe()).transform(request.body, { type: 'custom', metatype: LoginUserInputDto });

        return true;
    }
}
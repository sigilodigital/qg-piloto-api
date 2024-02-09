import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ValidationPipe } from '@sd-root/libs/common/src/validations/validation.pipe';
import { LoginUserInputDto } from 'src/auth/models/dto/login-user.dto';
// import { ValidationPipe } from 'src/shared/validation/validation.pipe';

@Injectable()
export class AuthUserValidate implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        await (new ValidationPipe()).transform(request.body, { type: 'custom', metatype: LoginUserInputDto });

        return true;
    }
}
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoginUser } from 'src/auth/dto/loginUser.dto';
import { ValidationPipe } from 'src/shared/validation/validation.pipe';

@Injectable()
export class ValidaAuthUserGuard implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        await (new ValidationPipe()).transform(request.body, { type: 'custom', metatype: LoginUser });

        return true;
    }
}
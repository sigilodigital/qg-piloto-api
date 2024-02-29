
import { ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { MSG } from '@libs/common/services/code-messages';
import { ApiResponse } from '@libs/common/services/api-response';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    readonly LOG_CLASS_NAME = 'LocalAuthGuard';

    constructor(private apiResponse: ApiResponse) { super(); }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user)
            throwSeErro(err, context, this);

        return user;

        async function throwSeErro<C extends LocalAuthGuard>(error: any, context: ExecutionContext, C?: C) {
            // throw new UnauthorizedException(C.apiResponse.handler({
            //     objMessage: MSG.ERR_AUTH_USR_INATIV,
            //     error: {
            //         message: "Erro durante tentativa de login",
            //         context: {
            //             className: C.LOG_CLASS_NAME,
            //             methodName: C.handleRequest.name,
            //             input: context,
            //             output: error
            //         }
            //     }
            // }));
        }
    }
}


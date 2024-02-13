import { GlobalService } from '@libs/common/services/global.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RouteSystemGuard } from './auth/guards/route-system.guard';
import configs from '@sd-root/libs/common/src/configs';
import { LoginSistemaInputDto } from './auth/models/dto/loginSistema.dto';

@Injectable()
export class AppMiddleware implements NestMiddleware {

    private routeGuard: RouteSystemGuard;

    constructor(/*private authService: AuthService*/) {
        this.routeGuard = new RouteSystemGuard();
    }

    async use(req: Request, res: Response, next: () => void) {
        this.activeDebugMode(req);
        this.swaggerAuth(req)

        await this.routeGuard.canActivate({ req, res });
        next();
    }

    activeDebugMode(req: Request){
        const isDebug = !!req.headers['debug-mode'];
        GlobalService.enableDebugModeInHeader = isDebug
    }

    swaggerAuth(req: Request){
        if((<LoginSistemaInputDto>req.body).agent === 'swagger')
        // !validade: 2024-02-13 17:00
            req.headers['token-system'] ??= 'System eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbkRhdGEiOnsic2lzdGVtYSI6eyJpZCI6Ijg3YThmZTYzLWQ2ZGMtNDdkNi1iNDhiLTg5YzQ1Y2FlMThiNyIsIm5hbWUiOiJTRC1Qb3J0YWwiLCJ1c2VybmFtZSI6InNkLXBvcnRhbCIsInBhc3N3b3JkIjoiJDJhJDEwJHNVOFdkQzVnZ2swMlZsTVRKNDFsV3VYeC9kVXBhS3l3VE1STGc3c0RKL3FPME1HVEFtREQuIiwiZGVzY3JpcHRpb24iOiJTaXN0ZW1hIHBhcmEgZ2VzdMOjbyBkZSBwb3J0YWlzIiwiaXNBY3RpdmUiOnRydWUsIl9tZXRvZG9MaXN0IjpbeyJpZCI6IjRkNmEyOTg2LWY3N2UtNDEzNC04ZDgyLTlhMjA0NjM5N2U4ZSIsIm5hbWUiOiJ1c3VhcmlvLWF1dGVudGljYXIiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWNhIGF1dGVudGljaWRhZGUgZG9zIHVzdcOhcmlvcyBkbyBzaXN0ZW1hIiwiaXNBY3RpdmUiOnRydWV9LHsiaWQiOiJhMDhiMzZmZS04ZjZjLTQyODgtOGNmMC1kYmQwMjY1NTFkOGQiLCJuYW1lIjoic2lzdGVtYS1hdXRlbnRpY2FyIiwiZGVzY3JpcHRpb24iOiJWZXJpZmljYSBhdXRlbnRpY2lkYWRlIGRvcyBzaXN0ZW1hcyBjbGllbnRlIiwiaXNBY3RpdmUiOnRydWV9LHsiaWQiOiI5Nzk3NmM3Zi1lMzlkLTQ0YzctOWY1MC0yZDRkZTA0MTdlODkiLCJuYW1lIjoidXN1YXJpby1saXN0YXIiLCJkZXNjcmlwdGlvbiI6IlJldG9ybmEgdW1hIGxpc3RhIGZpbHRyYWRhIGRlIHVzdcOhcmlvcyIsImlzQWN0aXZlIjp0cnVlfV19LCJtZXRvZG9MaXN0IjpbeyJpZCI6IjRkNmEyOTg2LWY3N2UtNDEzNC04ZDgyLTlhMjA0NjM5N2U4ZSIsIm5hbWUiOiJ1c3VhcmlvLWF1dGVudGljYXIiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWNhIGF1dGVudGljaWRhZGUgZG9zIHVzdcOhcmlvcyBkbyBzaXN0ZW1hIiwiaXNBY3RpdmUiOnRydWV9LHsiaWQiOiJhMDhiMzZmZS04ZjZjLTQyODgtOGNmMC1kYmQwMjY1NTFkOGQiLCJuYW1lIjoic2lzdGVtYS1hdXRlbnRpY2FyIiwiZGVzY3JpcHRpb24iOiJWZXJpZmljYSBhdXRlbnRpY2lkYWRlIGRvcyBzaXN0ZW1hcyBjbGllbnRlIiwiaXNBY3RpdmUiOnRydWV9LHsiaWQiOiI5Nzk3NmM3Zi1lMzlkLTQ0YzctOWY1MC0yZDRkZTA0MTdlODkiLCJuYW1lIjoidXN1YXJpby1saXN0YXIiLCJkZXNjcmlwdGlvbiI6IlJldG9ybmEgdW1hIGxpc3RhIGZpbHRyYWRhIGRlIHVzdcOhcmlvcyIsImlzQWN0aXZlIjp0cnVlfV19LCJpYXQiOjE3MDc3NzAzMDAsImV4cCI6MTcwNzg1NjcwMH0.iATcQ9djiQ6HtJLUhtYc-mYwmy9KPOpnQB1iBSqdovw'
    }

    // async use(req: any, res: any, next: () => void) {
    //     const token = await getValueHeaderKey(req['rawHeaders'], "Authorization");
    //     if (token) {
    //         const result = await this.authService.validarAcesso({ token, method: req.url });
    //         if (result) {
    //             next();
    //             return result;
    //         }
    //         const user = {
    //             token: req.body
    //         };
    //         const verificaToken = await this.authService.login(user);
    //         next();
    //         res['tokenSystem'] = verificaToken.access_token;
    //         return res;
    //     } else {
    //         // next();
    //         throw new HttpException(ApiResponse.handler({
    //             codNumber: 77
    //         }),
    //             HttpStatus.BAD_REQUEST);
    //     }
    // }
}
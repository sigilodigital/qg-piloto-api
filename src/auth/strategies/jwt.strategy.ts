import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configs from '@libs/common/configs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('token-system'),
            ignoreExpiration: false,
            secretOrKey: configs().auth.secretKey
        });
    }

    async validate(payload: any) {
        return payload;
    }
}

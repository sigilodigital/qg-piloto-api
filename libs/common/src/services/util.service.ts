import { Injectable } from "@nestjs/common";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import jwtDecode from "jwt-decode";

@Injectable()
export class UtilService implements IUtilService {
    private jwtService: JwtService;
    constructor() {
        this.jwtService = new JwtService();
    }

    async tokenGenerate(loginData: unknown, options?: { expiresIn?: string; }): Promise<string> {
        const payload = { loginData };
        const token = this.jwtService.sign(payload, options);
        return token;
    }

    async tokenVerify(token: string, options?: JwtVerifyOptions): Promise<string> {
        const result = await this.jwtService.verifyAsync(token, options);
        return result;
    }

    tokenDecodeWithoutVerify(token: string): unknown {
        const result = jwtDecode(token);
        return result;
    }

    async encrypt(pass: string): Promise<{ hash: string; }> {
        const saltOrRounds = 10;
        const password = pass;
        const hashGenerate = await hash(password, saltOrRounds);
        return { hash: hashGenerate };
    }

    async decrypt(password: string, hash: string): Promise<boolean> {
        const isMatch = await compare(password, hash);
        return isMatch;
    }

}

export interface IUtilService {
    tokenGenerate(loginData: unknown, options?: { expiresIn?: string; }): Promise<string>;
    tokenDecodeWithoutVerify(token: string): unknown;
    encrypt(pass: string): Promise<{ hash: string; }>;
    decrypt(password: string, hash: string): Promise<boolean>;
}
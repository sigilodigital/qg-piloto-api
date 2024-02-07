import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import jwtDecode from "jwt-decode";

@Injectable()
export class UtilService implements IUtilService {

    tokenDecode(token: string): unknown {
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
    tokenDecode(token: string): unknown;
    encrypt(pass: string): Promise<{ hash: string; }>;
    decrypt(password: string, hash: string): Promise<boolean>;
}
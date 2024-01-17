import { Injectable } from "@nestjs/common";
import jwtDecode from "jwt-decode";

@Injectable()
export class UtilService implements IUtilService {

    static tokenDecode(token: string): any {
        const result = jwtDecode(token);
        return result;
    }

    texto() { }
}

export interface IUtilService {
    texto();
}
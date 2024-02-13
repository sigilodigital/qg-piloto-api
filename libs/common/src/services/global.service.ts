import { Injectable } from "@nestjs/common";
import configs from "../configs";

@Injectable()
export class GlobalService {
    static enableDebugModeInHeader = true;

    static debugModeVerify(isOk: boolean = false): boolean {
        return isOk || (GlobalService.enableDebugModeInHeader && configs().enviroment.isDebugMode);
    }
}
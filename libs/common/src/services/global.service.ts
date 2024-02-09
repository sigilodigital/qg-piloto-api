import { Injectable } from "@nestjs/common";
import configs from "../configs";

@Injectable()
export class GlobalService {
    static enableDebugModeInHeader = true;

    static debugModeVerify(){
        return GlobalService.enableDebugModeInHeader && configs().enviroment.isDebugMode
    }
}
import { Injectable } from "@nestjs/common";

@Injectable()
export class GlobalService {
    static enableDebugModeHeader = false;

    static debugModeVerify(){
        return GlobalService.enableDebugModeHeader && JSON.parse(process.env.DEBUG_MODE)
    }
}
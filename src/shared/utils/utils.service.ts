import { UtilService } from '@libs/common/services/util.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {

    constructor(private util: UtilService){}
    async encryptText(text: string): Promise<string> {
        return <string><unknown>(await this.util.hashEncrypt(text))
    }

    async decryptText(text: string, hash: string) {
        return await this.util.hashCompare(text, hash)
    }

    codigoVerificacaoGerar(prefix = '', sufix = ''): string {
        return prefix + Math.random().toString(36).substr(2, 5).toUpperCase() + sufix;
    }
}

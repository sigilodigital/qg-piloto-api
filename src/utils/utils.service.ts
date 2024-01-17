import { Injectable } from '@nestjs/common';
import { decrypt, encrypt } from 'src/shared/utils';

@Injectable()
export class UtilsService {
    async encryptText(text: string): Promise<string> {
        return <string><unknown>(await encrypt(text))
    }

    async decryptText(text: string, hash: string) {
        return await decrypt(text, hash)
    }

    codigoVerificacaoGerar(prefix = '', sufix = ''): string {
        return prefix + Math.random().toString(36).substr(2, 5).toUpperCase() + sufix;
    }
}

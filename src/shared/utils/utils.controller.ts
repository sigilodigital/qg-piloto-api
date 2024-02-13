import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import exp from 'constants';
import { UtilsService } from './utils.service';
export interface IDecrypt {
    input: {
        text: string;
        hash: string;
    },
    output: {
        result: boolean;
    };
}

export class Decrypt {
    text: string;
    hash: string;
}

export interface IEncrypt {
    input: {
        text: string;
    },
    output: {
        text: string;
    };
}
export class Encrypt {
    text: string;
}

@Controller('utils')
export class UtilsController {
    constructor(private readonly utilsService: UtilsService) { }

    @ApiBody({ type: Encrypt })
    @Post('encrypt')
    async encript(@Body() obj: Encrypt): Promise<IEncrypt['output']> {

        return { text: await this.utilsService.encryptText(obj.text) };
    }

    @ApiBody({ type: Decrypt })
    @Post('decrypt')
    async decript(@Body() obj: IDecrypt['input']): Promise<IDecrypt['output']> {
        return { result: await this.utilsService.decryptText(obj.text, obj.hash) };
    }


}

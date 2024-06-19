
import { test as pTest, Page, chromium, expect as pExpect } from '@playwright/test';

import { ValidationPipe } from '@libs/common/validations/validation.pipe';
// import { SistemaLogin } from 'src/features/servicos/test/sistemaLogin';
import { LoginUserInputDto } from '../models/dto/login-user.dto';
import { SDExpectPlaywright } from '@libs/common/tests/expects-playwright';

pTest.describe('AutorizacaoRejeitar', () => {
    let page: Page;
    // let systemLogin: {token:string};
    let baseURL: '/auth/usuario-autenticar';
    let input: LoginUserInputDto;
    let field: string;

    pTest.beforeAll(async () => {
        // systemLogin = (await SistemaLogin.getLogin())
        page = await (await chromium.launch())?.newPage();
    });

    pTest.beforeEach(async () => {
        input = { username: 'abcd', password: 'abcd1234' };
    });

    pTest('deve retornar codigo 1', async () => {
        try {
            const res = (await page.request.post(baseURL, {
                data: {},
                // headers: { authorization: 'Bearer ' + systemLogin.token } 
            }));
            const result = await fnDtoAndLog(res);

            pExpect(result.status?.statusCode).toEqual(1);
        } catch (error) {
            await SDExpectPlaywright.fnNotCatchError(error, pExpect);
        }
    });

    field = 'username';
    pTest(`campo ${field} ausente`, async () => {
        input = { ...input, [field]: null };
        try {
            const result = await (new ValidationPipe()).transform(input, { type: 'custom', metatype: LoginUserInputDto });
            pExpect(result).toThrow();
        } catch (error) {
            await SDExpectPlaywright.fnCatchErrorDefault(error, pExpect);
        }
    });

    field = 'password';
    pTest(`campo ${field} ausente`, async () => {
        input = { ...input, [field]: null };
        try {
            const result = await (new ValidationPipe()).transform(input, { type: 'custom', metatype: LoginUserInputDto });
            pExpect(result).toEqual(input);
        } catch (error) {
            await SDExpectPlaywright.fnNotCatchError(error, pExpect);
        }
    });

    async function fnDtoAndLog(res: any) {
        const body = await res.json();
        const status = res.status();
        const statusText = res.statusText();
        const headers = res.headers();

        console.log('Body', body);
        console.log('Status', status, statusText);
        console.log('Headers', headers);

        return { body, status, headers };
    }
});
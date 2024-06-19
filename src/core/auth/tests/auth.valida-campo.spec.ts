
import { SDExpectPlaywright } from '@sd-root/libs/common/src/tests/expects-playwright';
import { ValidationPipe } from '@sd-root/libs/common/src/validations/validation.pipe';
import { LoginUserInputDto } from '../models/dto/login-user.dto';

describe('Validação de campos', () => {

    let input: LoginUserInputDto;
    let fieldList: string[];
    fieldList = ['username', 'password'];

    beforeEach(async () => {
        input = { username: 'abcd', password: 'abcd1234' };
    });

    for (let i = 0; i < fieldList.length; i++) {
        describe(`::${fieldList[i]}::`, () => {
            const field = fieldList[i];

            it(`campo nulo ou ausente`, async () => {
                input = { ...input, [field]: null };
                try {
                    const result = await (new ValidationPipe()).transform(input, { type: 'custom', metatype: LoginUserInputDto });
                    expect(result).toThrow();
                } catch (error) {
                    await SDExpectPlaywright.fnCatchErrorForRequired(error, expect);
                }
            });

            it(`tipo inválido`, async () => {
                input = { ...input, [field]: 123 };
                try {
                    const result = await (new ValidationPipe()).transform(input, { type: 'custom', metatype: LoginUserInputDto });
                    expect(result).toThrow();
                } catch (error) {
                    await SDExpectPlaywright.fnCatchErrorForType(error, expect);
                }
            });

            it(`tamanho inválido`, async () => {
                input = { ...input, [field]: '123456789012345678901234567890123456789012345678901' };
                try {
                    const result = await (new ValidationPipe()).transform(input, { type: 'custom', metatype: LoginUserInputDto });
                    expect(result).toThrow();
                } catch (error) {
                    await SDExpectPlaywright.fnCatchErrorForSize(error, expect);
                }
            });

            it(`valor inválido`, async () => {
                input = { ...input, [field]: '~' };
                try {
                    const result = await (new ValidationPipe()).transform(input, { type: 'custom', metatype: LoginUserInputDto });
                    expect(result).toThrow();
                } catch (error) {
                    await SDExpectPlaywright.fnCatchErrorForValue(error, expect);
                }
            });
        });
    }
});
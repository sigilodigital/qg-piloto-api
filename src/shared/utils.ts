import { compare, hash } from 'bcrypt';
import { AppDataSource } from '@sd-root/src/core/database';

export class utils {

    static util() {
        return { somenteNumeros, formatDate, isDate, encrypt, decrypt, getSequesce };
        async function somenteNumeros(entrada: any): Promise<boolean> {
            if (entrada == undefined) {
                return false;
            }
            const result = /^\d+$/.test(entrada);
            return result;

        }

        async function formatDate(date = new Date()) {
            return <Date><unknown>(date).toISOString().slice(0, 10);
        }

        function isDate(date: any) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && date instanceof Date;
        }


        async function encrypt(pass: string): Promise<{ hash: string; }> {
            const saltOrRounds = 10;
            const password = pass;
            const hashGenerate = await hash(password, saltOrRounds);
            return { hash: hashGenerate };
        }

        async function decrypt(password: string, hash: string): Promise<boolean> {
            const isMatch = await compare(password, hash);
            return isMatch;
        }

        async function getSequesce(sequenceName: string): Promise<number> {
            const sequence = await AppDataSource.manager.query(`SELECT IUSR_PROTON.${sequenceName}.NEXTVAL FROM dual`);
            return sequence[0].NEXTVAL;
        }
    }
}






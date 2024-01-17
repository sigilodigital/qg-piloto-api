/* eslint-disable @typescript-eslint/no-var-requires */
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/database';

export async function somenteNumeros(entrada: any):Promise<boolean>{
    if(entrada == undefined){
        return false
    }
    const result = /^\d+$/.test(entrada);
    return result
    
}

export async function formatDate(date = new Date()){
    return  <Date><unknown>(date).toISOString().slice(0, 10)
}

export function isDate(date : any){
   return date && Object.prototype.toString.call(date) === "[object Date]" && date instanceof Date
}


export async function encrypt(pass: string): Promise<{hash: string}>{
    const saltOrRounds = 10;
    const password = pass;
    const hashGenerate = await bcrypt.hash(password, saltOrRounds);
    return {hash: hashGenerate}
}

export async function decrypt(password: string, hash: string):Promise<boolean>{
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch
}

export async function getSequesce(sequenceName: string): Promise<number> {
     const sequence = await AppDataSource.manager.query(`SELECT IUSR_PROTON.${sequenceName}.NEXTVAL FROM dual`);
     return sequence[0].NEXTVAL;
}






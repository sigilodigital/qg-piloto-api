import { isDate } from "class-validator";
import configurations from "../configs";
import { TipoFormatoDataEnum } from "../enumerations/tipo-formato-data.enum";

export async function somenteNumeros(entrada: string): Promise<boolean> {
    return !!entrada?.match(/^\d+$/);
}

export async function formatDate(date = new Date()) {
    return <Date><unknown>(date).toISOString().slice(0, 10);
}

export interface IDateFormat{
    input: {
        typeFormat: TipoFormatoDataEnum, 
        data?:Date
    },
    output: {
        dateFormat: string,
        dateTime: Date;
        date: string;
        horaAtual: Date;
    }
}

export async function formatDateTime(input: IDateFormat['input']): Promise<IDateFormat['output']> {
    let data: Date;
    fnSetDate();
    const dataFormatada = [];
    const dtAtual = new Date();
    const separador = '/';
    const dataArray = data.toString().split(separador);
    if(!!dataArray && dataArray.length == 1) return {dateTime: new Date(dataArray[0]), dateFormat: data.toString(), horaAtual: new Date(), date: new Date().toString()}
    const dataTranf = new Date(dataArray[2] + separador + dataArray[1] + separador + dataArray[0]);
    const format = fnSetFormat(input.typeFormat);
    const formatDataArray = format.split("T")[0];
    const formatHoraArray =  format.split("T")[1];
    const dataHoraArray = []
    formatDataArray.split(separador).forEach((value)=>{
        dataHoraArray.push(value)
    })
    formatHoraArray.split(":").forEach((value)=>{
        dataHoraArray.push(value)
    })
     
    fnSetDataFormat(dataHoraArray);
    console.log(fnGetDateTime())    
    return {dateTime: new Date(fnGetDateTime()), dateFormat: fnGetDataFull(), horaAtual: new Date(), date: fnGetDate()}

    function fnSetFormat(typeFormat: TipoFormatoDataEnum){
        let format: string;
        
        return format;
    }

    function fnSetDataFormat(formatArray: any[]){
        for(const element of formatArray){
            const valor = element;
            if(valor == TipoFormatoDataEnum.DAY) dataFormatada.push({key: valor, value: ("0" + dataTranf.getDate()).slice(-2), separador});
            if(valor == TipoFormatoDataEnum.MONTH) dataFormatada.push({key: valor, value: ("0" + (dataTranf.getMonth() + 1)).slice(-2), separador});
            if(valor == TipoFormatoDataEnum.YEAR) dataFormatada.push({key: valor, value: dataTranf.getFullYear(), separador});
            if(valor == TipoFormatoDataEnum.HOURS) dataFormatada.push({key: valor, value: dtAtual.getHours(), separador: ":"});
            if(valor == TipoFormatoDataEnum.MINUTES) dataFormatada.push({key: valor, value: dtAtual.getMinutes(), separador: ":"});
            if(valor == TipoFormatoDataEnum.SECONDS) dataFormatada.push({key: valor, value: dtAtual.getSeconds(), separador: ":"});
        }
    }

    function fnGetDataPart(typeFormat: TipoFormatoDataEnum): Promise<string> {
        const objFind = dataFormatada.find((obj)=>{
            return obj.key === typeFormat
        })
        return objFind.value == undefined? "": objFind.value;
    }

    function fnGetDataFull() {
        let dataConcat = ``;
        for(let i = 0; i < dataFormatada.length; i++){
            dataConcat += dataFormatada[i].value + (i == 2? " ": dataFormatada[i].separador)
        }
        return dataConcat.substring(0, dataConcat.length - 1)
    }

    function fnGetDateTime(){
        const mes = <number><unknown>fnGetDataPart(TipoFormatoDataEnum.MONTH);
        return `${fnGetDataPart(TipoFormatoDataEnum.YEAR) + "-" + ("0"+mes).slice(-2)  + "-" +  fnGetDataPart(TipoFormatoDataEnum.DAY)} ${dtAtual.getHours()}:${dtAtual.getMinutes()}:${dtAtual.getSeconds()}`;
    }

    function fnGetDate(){
        const mes = <number><unknown>fnGetDataPart(TipoFormatoDataEnum.MONTH);
        return `${fnGetDataPart(TipoFormatoDataEnum.YEAR) + "-" + ("0"+mes).slice(-2)  + "-" +  fnGetDataPart(TipoFormatoDataEnum.DAY)}`;
    }

    function fnSetDate(){
        if(!input.data){
            data = new Date()
        } else {
            data = input.data
        }
    }

}


export async function isFnDate(date: any) {
    const validaDataEntrada = new Date(date);
    const resultadoValidacao = await isDate(validaDataEntrada);
    return resultadoValidacao;
}

export async function validaData(stringData: string) {
    /******** VALIDA DATA NO FORMATO DD/MM/AAAA *******/
    const regExpCaracter = /[^\d]/;     //Expressão regular para procurar caracter não-numérico.
    const regExpEspaco = /^\s+|\s+$/g;  //Expressão regular para retirar espaços em branco.

    if (stringData.length != 10) {
        return false;
    }

    const splitData = stringData.split('-');

    if (splitData.length != 3) {
        return false;
    }

    /* Retira os espaços em branco do início e fim de cada string. */
    splitData[0] = splitData[0].replace(regExpEspaco, '');
    splitData[1] = splitData[1].replace(regExpEspaco, '');
    splitData[2] = splitData[2].replace(regExpEspaco, '');

    if ((splitData[0].length != 4) || (splitData[1].length != 2) || (splitData[2].length != 2)) {
        return false;
    }

    /* Procura por caracter não-numérico. EX.: o "x" em "28/09/2x11" */
    if (regExpCaracter.test(splitData[0]) || regExpCaracter.test(splitData[1]) || regExpCaracter.test(splitData[2])) {
        return false;
    }

    const ano = parseInt(splitData[0], 10);
    const mes = parseInt(splitData[1], 10) - 1; //O JavaScript representa o mês de 0 a 11 (0->janeiro, 1->fevereiro... 11->dezembro)
    const dia = parseInt(splitData[2], 10);
    const novaData = new Date(ano, mes, dia);

    if ((novaData.getDate() != dia) || (novaData.getMonth() != mes) || (novaData.getFullYear() != ano)) {
        return false;
    }
    else {
        return true;
    }
}



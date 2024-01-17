import { cpf, cnpj } from 'cpf-cnpj-validator'; 
//import Joi = require('joi');

export function validaCPF(valor: string) : boolean{

    //console.log(validator(Joi).messages)

    return cpf.isValid(valor)
}

export function validaCNPJ(valor: string) : boolean{
    //console.log(validator(Joi).messages)
    return cnpj.isValid(valor)
}
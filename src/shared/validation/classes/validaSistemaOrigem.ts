import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { SegSistemaWs } from 'src/auth/entities/segSistemaWs';
import { AppDataSource } from 'src/database';


@ValidatorConstraint({ name: 'ValidaSistemaOrigem', async: true })
export class ValidaSistemaOrigem implements ValidatorConstraintInterface {

  async validate(text: string, args: ValidationArguments) {
    if(text == undefined){
        return true
    }else{
        const sistemasWs = await AppDataSource.manager.findOne(SegSistemaWs, {where: {txtLogin: args.object['loginSistemaOrigem']}})
        if(sistemasWs){
          return true
        }else return false

    }
  } 


  
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Text (${args}) is too short or too long!`;
  }
}



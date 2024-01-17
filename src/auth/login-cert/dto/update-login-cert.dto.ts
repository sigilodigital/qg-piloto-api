import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginCertDto } from './create-login-cert.dto';

export class UpdateLoginCertDto extends PartialType(CreateLoginCertDto) {}

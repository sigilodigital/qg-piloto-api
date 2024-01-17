import { Injectable } from '@nestjs/common';
import { restPki } from '../Lacuna/lacuna-restpki';
import { AxiosRequestConfig } from 'axios';
import { client } from '../Lacuna/restpki-client';
import { HttpService } from '@nestjs/axios';
import { NextFunction, Request } from 'express';

@Injectable()
export class PkiService implements IPkiService {

    constructor(private httpService: HttpService) { }

    async getPkiToken(next: NextFunction): Promise<string> {

        // Set a SecurityContext to be used to determine trust in the certificate chain for the authentication
        const securityContextId = restPki.standardSecurityContexts.pkiBrazil;

        const url: string = client.endpoint + 'Api/Authentications';
        const config: AxiosRequestConfig = {
            method: "POST",
            headers: { Authorization: 'Bearer ' + client.accessToken },
            data: { securityContextId: securityContextId }
        };

        const respClient = await this.httpService.axiosRef(url, config);

        if (restPki.checkResponse(null, respClient, respClient.data, next)) {
            const token = respClient.data.token;
            return token;
        }

    }


    async getPkiCertificate(body: { token: string; }): Promise<any> {

        const url: string = client.endpoint + 'Api/Authentications/' + body.token + '/Finalize';
        const config: AxiosRequestConfig = {
            method: "POST",
            headers: { Authorization: 'Bearer ' + client.accessToken },
            data: body
        };

        // const respClient = await this.httpService.axiosRef(url, config).catch((r) => {
        const result = await this.httpService.axiosRef(url, config);

        if (result.data?.certificate) {
            return result.data.certificate;
        } else {
            return result.data.validationResults;
        }

    }

}

export interface IPkiService {
    getPkiToken(next: NextFunction): Promise<string>;
    getPkiCertificate(body: { token: string; }): Promise<any>;
}
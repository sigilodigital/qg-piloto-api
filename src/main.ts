import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs = require('fs');
import pack from 'src/../package.json'

import { AppModule } from './app.module';
import configurations from './config/configurations';

async function bootstrap() {
    //   const httpsOptions = {
    //     key: fs.readFileSync('./src/auth/cert/key.pem','ascii'),
    //     cert: fs.readFileSync('./src/auth/cert/cert.pem', 'ascii'),
    //   }
    //console.log(httpsOptions);
    const app = await NestFactory.create(AppModule);

    const swaggerDocumentConfig = new DocumentBuilder()
        .setTitle('API - Gestão de Acesso')
        .setDescription('API Restful para o gerenciamento de acesso dos usuários.')
        .setVersion(pack.version)
        .build();
    const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);
    app.enableCors();
    //app.useGlobalPipes(new ValidationPipe())

    SwaggerModule.setup('api', app, document);

    await app.listen(configurations().server.port, "0.0.0.0");
    console.log(`Nome: ${pack.name}`);
    console.log(`Descrição: ${pack.description}`);
    console.log(`Versão: ${pack.version}`);
    console.log(`URL: ${await app.getUrl()}`);

}
bootstrap();

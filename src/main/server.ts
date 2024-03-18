/* eslint-disable import/first */
require('dotenv').config();

import { ExceptionInterceptor } from '@/application/interceptor/exception.interceptor';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import helmet from 'helmet';
import { ServerModule } from './server.module';

const port = process.env.PORT ?? 3000;

async function bootstrap(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        console.log('[Servidor]: Ambiente Produtivo.');
    } else {
        console.log('[Servidor]: Ambiente Desenvolvimento.');
    }

    const app = await NestFactory.create(ServerModule);

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'none'"],
                    styleSrc: ["'none'"],
                    imgSrc: ["'none'"],
                    fontSrc: ["'none'"],
                    workerSrc: ["'none'"]
                }
            }
        })
    );

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionInterceptor(httpAdapter));

    const config = new DocumentBuilder().setTitle('FIAP - 25 API').setDescription('Documentação API.').setVersion('2.0.0').addServer(`http://localhost:${port}`, 'Servidor de Desenvolvimento').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

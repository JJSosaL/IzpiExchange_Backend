import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '#modules/App.module.js';
import { APP_PORT } from './config.js';

const app = await NestFactory.create(AppModule);

// Todas las rutas dentro de la aplicación empezarán por '/api/..endpoint'.
app.setGlobalPrefix('api');

await app.listen(APP_PORT);

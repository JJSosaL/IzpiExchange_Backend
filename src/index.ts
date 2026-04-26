import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '#modules/App.module.js';
import { APP_PORT } from './config.js';
import type { UserDocument } from './schemas/MongoDB/User/User.types.js';

const app = await NestFactory.create(AppModule);

// Todas las rutas dentro de la aplicación empezarán por '/api/..endpoint'.
app.setGlobalPrefix('api');

await app.listen(APP_PORT);

declare module 'express' {
	interface Request {
		user: UserDocument;
	}
}

declare module 'socket.io' {
	interface Client {
		data: {
			user: UserDocument;
		};
	}
}

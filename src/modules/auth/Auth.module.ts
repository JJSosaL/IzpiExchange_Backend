import { Module } from '@nestjs/common';
import { EmailModule } from '#modules/email/Email.module.js';
import { AuthController } from './Auth.controller.js';
import { AuthService } from './Auth.service.js';

@Module({
	controllers: [
		AuthController,
	],
	imports: [
		EmailModule,
	],
	providers: [
		AuthService,
	],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '#modules/Email/Email.module.js';
import {
	SignUpOneTimePassword,
	SignUpOneTimePasswordSchema,
} from '#mongo/SignUpOneTimePassword.js';
import { AuthController } from './Auth.controller.js';
import { AuthService } from './Auth.service.js';

@Module({
	controllers: [
		AuthController,
	],
	imports: [
		EmailModule,
		MongooseModule.forFeature([
			{
				name: SignUpOneTimePassword.name,
				schema: SignUpOneTimePasswordSchema,
			},
		]),
	],
	providers: [
		AuthService,
	],
})
export class AuthModule {}

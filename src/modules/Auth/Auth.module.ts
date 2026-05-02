import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '#modules/Email/Email.module.js';
import { JsonWebTokenModule } from '#modules/JsonWebToken/JsonWebToken.module.js';
import { OneTimePassword, OneTimePasswordSchema } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.schema.js';
import { User, UserSchema } from '#schemas/MongoDB/User/User.schema.js';
import { AuthController } from './Auth.controller.js';
import { AuthService } from './Auth.service.js';

@Module({
	controllers: [
		AuthController,
	],
	imports: [
		EmailModule,
		JsonWebTokenModule,
		MongooseModule.forFeature([
			{
				name: OneTimePassword.name,
				schema: OneTimePasswordSchema,
			},
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	providers: [
		AuthService,
	],
})
export class AuthModule {}

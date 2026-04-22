import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '#modules/Email/Email.module.js';
import { JWT_SECRET } from '#root/config.js';
import {
	OneTimePassword,
	OneTimePasswordSchema,
} from '#schemas/MongoDB/OneTimePassword/OneTimePassword.schema.js';
import { User, UserSchema } from '#schemas/MongoDB/User/User.schema.js';
import { AuthController } from './Auth.controller.js';
import { AuthService } from './Auth.service.js';

@Module({
	controllers: [
		AuthController,
	],
	imports: [
		EmailModule,
		JwtModule.register({
			global: true,
			secret: JWT_SECRET,
			signOptions: {
				expiresIn: '10m',
			},
			verifyOptions: {
				algorithms: [
					'HS512',
				],
			},
		}),
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
		MongooseModule.forFeature([
			{
				name: OneTimePassword.name,
				schema: OneTimePasswordSchema,
			},
		]),
	],
	providers: [
		AuthService,
	],
})
export class AuthModule {}

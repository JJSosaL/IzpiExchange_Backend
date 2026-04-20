import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '#modules/Email/Email.module.js';
import { SignUpOtp, SignUpOtpSchema } from '#mongo/SignUpOtp.js';
import { User, UserSchema } from '#mongo/User.js';
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
				name: User.name,
				schema: UserSchema,
			},
		]),
		MongooseModule.forFeature([
			{
				name: SignUpOtp.name,
				schema: SignUpOtpSchema,
			},
		]),
	],
	providers: [
		AuthService,
	],
})
export class AuthModule {}

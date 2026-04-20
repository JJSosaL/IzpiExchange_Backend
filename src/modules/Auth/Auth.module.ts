import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '#modules/Email/Email.module.js';
import { Account, AccountSchema } from '#mongo/Account.js';
import { SignUpOtp, SignUpOtpSchema } from '#mongo/SignUpOtp.js';
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
				name: Account.name,
				schema: AccountSchema,
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

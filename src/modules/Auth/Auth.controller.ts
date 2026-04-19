import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import dayjs from 'dayjs';
import { ZodValidationPipe } from '#common/pipes/ZodValidation.pipe.js';
import { EmailService } from '#modules/Email/Email.service.js';
import { MongoOrm } from '#prisma/Database.js';
import { SignUpSchema, type SignUpSchemaDto } from '#zod/AuthSchema.js';
import { AuthService } from './Auth.service.js';

@Controller('auth')
export class AuthController {
	public constructor(
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(EmailService) private readonly emailService: EmailService,
	) {}

	@Post('sign-up')
	@UsePipes(new ZodValidationPipe(SignUpSchema))
	protected async handleAccountCreation(@Body() signUpData: SignUpSchemaDto) {
		const { email, password } = signUpData;

		const otp = this.authService.generateOneTimePasswordCode();

		const otpExpiration = dayjs().add(10, 'minutes');
		const otpExpirationDate = otpExpiration.toDate();

		await this.emailService.sendOneTimePasswordMail({
			otpCode: otp,
			recipient: email,
		});

		await MongoOrm.pendingAccountVerification.create({
			createdAt: new Date(),
			email,
			expiresIn: otpExpirationDate,
			otp,
			password,
			updatedAt: new Date(),
		});

		/*
		 * Indicar a la aplicación que el siguiente paso será verificar el código
		 * 'One-Time Password'.
		 */
		return {
			step: 'VERIFY_OTP',
		};
	}
}

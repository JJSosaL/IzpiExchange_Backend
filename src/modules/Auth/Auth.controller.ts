import { randomUUID } from 'node:crypto';
import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import type { Connection, Model } from 'mongoose';
import { ZodValidationPipe } from '#common/pipes/ZodValidation.pipe.js';
import {
	ACCOUNT_WITH_SAME_EMAIL_ALREADY_REGISTERED_RESPONSE,
	EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE,
} from '#lib/Responses/Auth.js';
import { NOT_FOUND_RESPONSE } from '#lib/Responses/Shared.js';
import { EmailService } from '#modules/Email/Email.service.js';
import { SignUpOtp } from '#mongo/SignUpOtp.js';
import { User } from '#mongo/User.js';
import {
	SignUpSchema,
	type SignUpSchemaDto,
	VerifySignUpOtpSchema,
	type VerifySignUpOtpSchemaDto,
} from '#zod/AuthSchema.js';
import { AuthService } from './Auth.service.js';

@Controller('auth')
export class AuthController {
	private static OTP_MINUTES = 5 as const;

	public constructor(
		@InjectConnection() private readonly connection: Connection,

		@InjectModel(SignUpOtp.name)
		private readonly signUpOtpModel: Model<SignUpOtp>,
		@InjectModel(User.name) private readonly userModel: Model<User>,

		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(EmailService) private readonly emailService: EmailService,
		@Inject(JwtService) private readonly jwtService: JwtService,
	) {}

	@Post('sign-up')
	@UsePipes(new ZodValidationPipe(SignUpSchema))
	protected async handleSignUp(@Body() signUpData: SignUpSchemaDto) {
		const { email } = signUpData;

		// Verificar que el correo electrónico proviene de un dominio permitido.
		const isValidEmailDomain = this.emailService.isValidEmailDomain(email);

		if (!isValidEmailDomain) {
			throw EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE();
		}

		const otp = this.authService.generateOneTimePasswordCode();

		const otpExpiration = dayjs().add(AuthController.OTP_MINUTES, 'minutes');
		const otpExpirationDate = otpExpiration.toDate();

		await this.signUpOtpModel.create({
			email,
			expiresIn: otpExpirationDate,
			otp,
		});

		await this.emailService.sendOneTimePasswordMail({
			otpCode: otp,
			recipient: email,
		});

		return {};
	}

	@Post('sign-up/verify-otp')
	@UsePipes(new ZodValidationPipe(VerifySignUpOtpSchema))
	protected async verifySignUpOtp(@Body() verifyOtpData: VerifySignUpOtpSchemaDto) {
		const { otp } = verifyOtpData;

		const otpDocument = await this.signUpOtpModel.findOne({
			otp,
		});

		if (!otpDocument) {
			throw NOT_FOUND_RESPONSE();
		}

		/*
		 * Verificamos si el código 'One-Time Password' ha expirado.
		 *
		 * En caso verdadero, debido a que el documento existe pero ha expirado,
		 * eliminamos el documento de la base de datos.
		 */
		if (otpDocument.hasAlreadyExpired) {
			await this.signUpOtpModel.deleteOne({
				otp,
			});

			throw NOT_FOUND_RESPONSE();
		}

		const { email } = otpDocument;
		const { username } = this.emailService.parseEmail(email);

		const userDocument = await this.userModel.findOne({
			email,
		});

		/*
		 * Comprobamos si ya existe una cuenta con el mismo correo electrónico
		 * asociado.
		 */
		if (userDocument) {
			throw ACCOUNT_WITH_SAME_EMAIL_ALREADY_REGISTERED_RESPONSE();
		}

		const userId = randomUUID();
		const session = await this.connection.startSession();

		await session.withTransaction(async () => {
			await this.signUpOtpModel.deleteOne(
				{
					otp,
				},
				{
					session,
				},
			);
			await this.userModel.create(
				[
					{
						email,
						id: userId,
						username,
					},
				],
				{
					session,
				},
			);
		});

		const accessToken = await this.jwtService.signAsync({
			userId,
			username,
		});

		return {
			accessToken,
		};
	}
}

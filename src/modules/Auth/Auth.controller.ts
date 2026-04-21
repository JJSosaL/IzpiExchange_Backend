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
import { INTERNAL_SERVER_ERROR, NOT_FOUND_RESPONSE } from '#lib/Responses/Shared.js';
import { EmailService } from '#modules/Email/Email.service.js';
import { OneTimePassword } from '#root/schemas/MongoDB/OneTimePassword/OneTimePassword.js';
import { OneTimePasswordAction } from '#root/schemas/MongoDB/OneTimePassword/OneTimePassword.types.js';
import { User } from '#schemas/MongoDB/User/User.schema.js';
import {
	type SignInDto,
	SignInSchema,
	type SignUpDto,
	SignUpSchema,
	type VerifyOneTimePasswordDto,
	VerifyOneTimePasswordSchema,
} from '#schemas/Zod/Auth/Auth.schema.js';
import { AuthService } from './Auth.service.js';

@Controller('auth')
export class AuthController {
	private static OTP_AUTH_MINUTES = 5 as const;

	public constructor(
		@InjectConnection() private readonly connection: Connection,

		@InjectModel(OneTimePassword.name)
		private readonly oneTimePasswordModel: Model<OneTimePassword>,
		@InjectModel(User.name) private readonly userModel: Model<User>,

		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(EmailService) private readonly emailService: EmailService,
		@Inject(JwtService) private readonly jwtService: JwtService,
	) {}

	@Post('sign-in')
	@UsePipes(new ZodValidationPipe(SignInSchema))
	protected async handleSignIn(@Body() signInData: SignInDto) {
		const { email } = signInData;

		// Verificar que el correo electrónico proviene de un dominio permitido.
		const isValidEmailDomain = this.emailService.isValidEmailDomain(email);

		if (!isValidEmailDomain) {
			throw EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE();
		}

		const otp = this.authService.generateOneTimePasswordCode();

		const otpExpiration = dayjs().add(AuthController.OTP_AUTH_MINUTES, 'minutes');
		const otpExpirationDate = otpExpiration.toDate();

		await this.oneTimePasswordModel.create({
			action: OneTimePasswordAction.SignIn,
			email,
			expiresIn: otpExpirationDate,
			otp,
		});

		await this.emailService.sendSignInMail({
			otpCode: otp,
			recipient: email,
		});

		return {};
	}

	@Post('sign-up')
	@UsePipes(new ZodValidationPipe(SignUpSchema))
	protected async handleSignUp(@Body() signUpData: SignUpDto) {
		const { email } = signUpData;

		// Verificar que el correo electrónico proviene de un dominio permitido.
		const isValidEmailDomain = this.emailService.isValidEmailDomain(email);

		if (!isValidEmailDomain) {
			throw EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE();
		}

		const otp = this.authService.generateOneTimePasswordCode();

		const otpExpiration = dayjs().add(AuthController.OTP_AUTH_MINUTES, 'minutes');
		const otpExpirationDate = otpExpiration.toDate();

		await this.oneTimePasswordModel.create({
			action: OneTimePasswordAction.SignUp,
			email,
			expiresIn: otpExpirationDate,
			otp,
		});

		await this.emailService.sendSignUpMail({
			otpCode: otp,
			recipient: email,
		});

		return {};
	}

	@Post('verify-otp')
	@UsePipes(new ZodValidationPipe(VerifyOneTimePasswordSchema))
	protected async verifySignUpOtp(@Body() verifyOtpData: VerifyOneTimePasswordDto) {
		const { action, otp } = verifyOtpData;

		const otpDocument = await this.oneTimePasswordModel.findOne({
			action,
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
			await this.oneTimePasswordModel
				.deleteOne({
					action,
					otp,
				})
				.then(() => {
					throw NOT_FOUND_RESPONSE();
				});
		}

		const { email } = otpDocument;

		switch (action) {
			case OneTimePasswordAction.SignIn: {
				const userDocument = await this.userModel.findOne({
					email,
				});

				if (!userDocument) {
					throw NOT_FOUND_RESPONSE();
				}

				const { id, username } = userDocument;
				const accessToken = await this.jwtService.signAsync({
					userId: id,
					username,
				});

				await this.oneTimePasswordModel.deleteOne({
					action,
					otp,
				});

				return {
					accessToken,
				};
			}
			case OneTimePasswordAction.SignUp: {
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

				const { username } = this.emailService.parseEmail(email);

				const userId = randomUUID();
				const session = await this.connection.startSession();

				await session.withTransaction(async () => {
					await this.oneTimePasswordModel.deleteOne(
						{
							action,
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
			default: {
				throw INTERNAL_SERVER_ERROR();
			}
		}
	}
}

import { randomUUID } from 'node:crypto';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import type { Connection, Model } from 'mongoose';
import { match } from 'ts-pattern';
import { ZodValidationPipe } from '#common/Pipes/ZodValidation.pipe.js';
import {
	ACCOUNT_WITH_SAME_EMAIL_ALREADY_REGISTERED_RESPONSE,
	EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE,
} from '#lib/Responses/Auth.js';
import { NOT_FOUND_RESPONSE } from '#lib/Responses/Shared.js';
import { EmailService } from '#modules/Email/Email.service.js';
import { JsonWebTokenService } from '#modules/JsonWebToken/JsonWebToken.service.js';
import { OneTimePassword } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.schema.js';
import { OneTimePasswordAction } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.types.js';
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
	public constructor(
		@InjectConnection() private readonly connection: Connection,

		@InjectModel(OneTimePassword.name)
		private readonly oneTimePasswordModel: Model<OneTimePassword>,
		@InjectModel(User.name) private readonly userModel: Model<User>,

		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(EmailService) private readonly emailService: EmailService,
		@Inject(JsonWebTokenService) private readonly jsonWebTokenService: JsonWebTokenService,
	) {}

	@Post('sign-in')
	@HttpCode(HttpStatus.ACCEPTED)
	protected async handleSignIn(@Body(new ZodValidationPipe(SignInSchema)) signInData: SignInDto) {
		const { email } = signInData;

		/*
		 * Validar que el correo electrónico proviene de un dominio permitido.
		 * En caso contrario, se lanzará una instancia de 'HttpException'.
		 */
		const isValidEmailDomain = this.emailService.isValidEmailDomain(email);

		if (!isValidEmailDomain) {
			throw EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE();
		}

		const otpCode = await this.authService.generateOneTimePasswordCode({
			action: OneTimePasswordAction.SignIn,
			email,
		});

		await this.emailService.sendSignInMail({
			otpCode,
			recipient: email,
		});

		return {
			step: 'VERIFY_OTP',
		};
	}

	@Post('sign-up')
	@HttpCode(HttpStatus.ACCEPTED)
	protected async handleSignUp(@Body(new ZodValidationPipe(SignUpSchema)) signUpData: SignUpDto) {
		const { email } = signUpData;

		/*
		 * Validar que el correo electrónico proviene de un dominio permitido.
		 * En caso contrario, se lanzará una instancia de 'HttpException'.
		 */
		const isValidEmailDomain = this.emailService.isValidEmailDomain(email);

		if (!isValidEmailDomain) {
			throw EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE();
		}

		const otpCode = await this.authService.generateOneTimePasswordCode({
			action: OneTimePasswordAction.SignUp,
			email,
		});

		await this.emailService.sendSignUpMail({
			otpCode,
			recipient: email,
		});

		return {
			step: 'VERIFY_OTP',
		};
	}

	@Post('verify-otp')
	protected async verifySignUpOtp(
		@Body(new ZodValidationPipe(VerifyOneTimePasswordSchema))
		verifyOtpData: VerifyOneTimePasswordDto,
	) {
		const { action, otpCode } = verifyOtpData;

		const oneTimePasswordDocument = await this.authService.getOneTimePassword({
			action,
			otpCode,
		});

		const { email } = oneTimePasswordDocument;

		return match(action)
			.with(OneTimePasswordAction.SignIn, async () => {
				const userDocument = await this.userModel.findOne({
					email,
				});

				if (!userDocument) {
					throw NOT_FOUND_RESPONSE();
				}

				const { id } = userDocument;
				const accessToken = await this.jsonWebTokenService.sign(id);

				await this.oneTimePasswordModel.deleteOne({
					action,
					otpCode,
				});

				return {
					accessToken,
				};
			})
			.with(OneTimePasswordAction.SignUp, async () => {
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
							otpCode,
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

				const accessToken = await this.jsonWebTokenService.sign(userId);

				return {
					accessToken,
				};
			})
			.run();
	}
}

import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import type { Model } from 'mongoose';
import type { OneTimePasswordAction } from '#root/schemas/MongoDB/OneTimePassword/OneTimePassword.types.js';
import { OneTimePassword } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.js';

@Injectable()
export class AuthService {
	private static OTP_MAX_LENGTH = 999999 as const;
	private static OTP_MIN_LENGTH = 100000 as const;

	public static OTP_EXPIRATION_MINUTES = 5 as const;

	public constructor(
		@InjectModel(OneTimePassword.name)
		private readonly oneTimePasswordModel: Model<OneTimePassword>,
	) {}

	public async generateOneTimePasswordCode(
		options: GenerateOneTimePasswordCodeOptions,
	): Promise<string> {
		const { action, email } = options;

		const otpInteger = randomInt(AuthService.OTP_MIN_LENGTH, AuthService.OTP_MAX_LENGTH);
		const otpString = otpInteger.toString();

		const otpExpiration = dayjs().add(AuthService.OTP_EXPIRATION_MINUTES, 'minutes');
		const otpExpirationDate = otpExpiration.toDate();

		await this.oneTimePasswordModel.create({
			action,
			email,
			expiresIn: otpExpirationDate,
			otp: otpString,
		});

		return otpString;
	}
}

interface GenerateOneTimePasswordCodeOptions {
	action: OneTimePasswordAction;
	email: string;
}

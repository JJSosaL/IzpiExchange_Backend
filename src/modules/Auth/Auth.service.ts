import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import type { Model } from 'mongoose';
import { NOT_FOUND_RESPONSE } from '#lib/Responses/Shared.js';
import { OneTimePassword } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.schema.js';
import type {
	OneTimePasswordAction,
	OneTimePasswordDocument,
} from '#schemas/MongoDB/OneTimePassword/OneTimePassword.types.js';

@Injectable()
export class AuthService {
	private static OTP_MAX_LENGTH = 999999 as const;
	private static OTP_MIN_LENGTH = 100000 as const;

	public static OTP_EXPIRATION_MINUTES = 5 as const;

	public constructor(
		@InjectModel(OneTimePassword.name)
		private readonly oneTimePasswordModel: Model<OneTimePassword>,
	) {}

	public async generateOneTimePasswordCode(options: GenerateOneTimePasswordCodeOptions): Promise<string> {
		const { action, email } = options;

		const otpCodeInteger = randomInt(AuthService.OTP_MIN_LENGTH, AuthService.OTP_MAX_LENGTH);
		const otpCode = otpCodeInteger.toString();

		const otpExpiration = dayjs().add(AuthService.OTP_EXPIRATION_MINUTES, 'minutes');
		const otpExpirationDate = otpExpiration.toDate();

		await this.oneTimePasswordModel.create({
			action,
			email,
			expiresIn: otpExpirationDate,
			otpCode,
		});

		return otpCode;
	}

	public async getOneTimePassword(options: GetOneTimePasswordOptions): Promise<OneTimePasswordDocument> {
		const { action, otpCode } = options;

		const oneTimePasswordDocument = await this.oneTimePasswordModel.findOneAndDelete({
			action,
			expiresIn: {
				$gt: new Date(),
			},
			otpCode,
		});

		if (!oneTimePasswordDocument) {
			throw NOT_FOUND_RESPONSE();
		}

		return oneTimePasswordDocument;
	}
}

interface GetOneTimePasswordOptions {
	action: OneTimePasswordAction;
	otpCode: string;
}

interface GenerateOneTimePasswordCodeOptions {
	action: OneTimePasswordAction;
	email: string;
}

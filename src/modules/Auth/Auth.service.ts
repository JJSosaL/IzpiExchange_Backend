import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import type { Model } from 'mongoose';
import { OneTimePassword } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.js';

@Injectable()
export class AuthService {
	private static OTP_MAX_LENGTH = 999999 as const;
	private static OTP_MIN_LENGTH = 100000 as const;

	public constructor(
		@InjectModel(OneTimePassword.name)
		private readonly oneTimePasswordModel: Model<OneTimePassword>,
	) {}

	@Cron('* * * * *') // Ejecutar cada minuto.
	protected async deleteExpiredOneTimePasswords(): Promise<void> {
		const { deletedCount } = await this.oneTimePasswordModel.deleteMany({
			expiresIn: {
				$lt: new Date(),
			},
		});

		console.log(`Se han eliminado ${deletedCount} documento(s) expirados`);
	}

	public generateOneTimePasswordCode(): string {
		const otpInteger = randomInt(AuthService.OTP_MIN_LENGTH, AuthService.OTP_MAX_LENGTH);
		const otpString = otpInteger.toString();

		return otpString;
	}
}

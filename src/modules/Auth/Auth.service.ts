import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
	private static BCRYPT_SALT_LENGTH = 12 as const;

	private static OTP_MAX_LENGTH = 999999 as const;
	private static OTP_MIN_LENGTH = 100000 as const;

	/**
	 * Crea un 'hash' de la contraseña introducida.
	 *
	 * @param password - La contraseña a 'hashear'.
	 * @returns El 'hash' de la contraseña introducida.
	 */
	public async createPasswordHash(password: string): Promise<string> {
		return await hash(password, AuthService.BCRYPT_SALT_LENGTH);
	}

	/**
	 * Genera un código 'One-Time Password' para verificar la creación de la
	 * cuenta.
	 *
	 * @returns El código 'One-Time Password' como una cadena de texto.
	 */
	public generateOneTimePasswordCode(): string {
		const otpInteger = randomInt(AuthService.OTP_MIN_LENGTH, AuthService.OTP_MAX_LENGTH);
		const otpString = otpInteger.toString();

		return otpString;
	}
}

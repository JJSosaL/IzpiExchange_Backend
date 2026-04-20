import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	private static OTP_MAX_LENGTH = 999999 as const;
	private static OTP_MIN_LENGTH = 100000 as const;

	/**
	 * Genera un código 'One-Time Password' para verificar cualquier acción
	 * importante sobre las cuentas.
	 *
	 * @returns El código 'One-Time Password' como una cadena de texto.
	 */
	public generateOneTimePasswordCode(): string {
		const otpInteger = randomInt(AuthService.OTP_MIN_LENGTH, AuthService.OTP_MAX_LENGTH);
		const otpString = otpInteger.toString();

		return otpString;
	}
}

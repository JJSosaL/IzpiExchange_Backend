import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { ParsedMailbox } from 'email-addresses';
import { ALLOWED_EMAIL_DOMAIN } from '#root/config.js';

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

	/**
	 * Verifica que el correo electrónico proviene de un dominio permitido.
	 *
	 * @param email - El correo electrónico a verificar si proviene de un dominio
	 * permitido.
	 */
	public isValidEmailDomain(email: string): boolean {
		const emailStringData = emailAddresses.parseOneAddress(email) as ParsedMailbox;
		const { domain } = emailStringData;

		return domain === ALLOWED_EMAIL_DOMAIN;
	}
}

import email, { type ParsedMailbox } from 'email-addresses';
import { z } from 'zod';
import { ALLOWED_EMAIL_DOMAIN } from '#root/config.js';

const SIGN_UP_PASSWORD_MAX_LENGTH = 20;
const SIGN_UP_PASSWORD_MIN_LENGTH = 8;

/**
 * Verifica que el correo electrónico proviene de un dominio válido.
 */
const validateEmailDomain = (emailString: string): boolean => {
	const emailStringData = email.parseOneAddress(emailString) as ParsedMailbox;
	const { domain } = emailStringData;

	return domain === ALLOWED_EMAIL_DOMAIN;
};

export const SignUpSchema = z.object({
	email: z
		.email('El correo electrónico debe tener un formato válido')
		.refine(validateEmailDomain, {
			error: 'El correo electrónico debe tener un dominio válido',
		}),
	password: z
		.string('La contraseña debe ser una cadena de texto')
		.min(SIGN_UP_PASSWORD_MIN_LENGTH, 'La contraseña debe tener 8 caracteres como mínimo')
		.max(SIGN_UP_PASSWORD_MAX_LENGTH, 'La contraseña debe tener 20 caracteres como máximo'),
});

export type SignUpSchemaDto = z.infer<typeof SignUpSchema>;

import emailAddresses, { type ParsedMailbox } from 'email-addresses';
import { email, object, string, type infer as ZodInfer } from 'zod';
import { ALLOWED_EMAIL_DOMAIN } from '#root/config.js';

const SIGN_UP_PASSWORD_MAX_LENGTH = 20;
const SIGN_UP_PASSWORD_MIN_LENGTH = 8;

const OTP_LENGTH = 6;

/**
 * Verifica que el correo electrónico proviene de un dominio permitido.
 */
const validateEmailDomain = (emailString: string): boolean => {
	const emailStringData = emailAddresses.parseOneAddress(emailString) as ParsedMailbox;
	const { domain } = emailStringData;

	return domain === ALLOWED_EMAIL_DOMAIN;
};

export const SignUpSchema = object(
	{
		email: email('El correo electrónico debe tener un formato válido').refine(
			validateEmailDomain,
			{
				error: 'El correo electrónico debe tener un dominio válido',
			},
		),
		password: string('La contraseña debe ser una cadena de texto')
			.min(SIGN_UP_PASSWORD_MIN_LENGTH, 'La contraseña debe tener 8 caracteres como mínimo')
			.max(SIGN_UP_PASSWORD_MAX_LENGTH, 'La contraseña debe tener 20 caracteres como máximo'),
	},
	'El cuerpo de la petición debe ser un objeto',
);

export const VerifyOtpSchema = object(
	{
		otp: string('El código OTP debe ser una cadena de texto').length(
			OTP_LENGTH,
			'El código OTP debe tener 6 caracteres',
		),
	},
	'El cuerpo de la petición debe ser un objeto',
);

export type SignUpSchemaDto = ZodInfer<typeof SignUpSchema>;
export type VerifyOtpSchemaDto = ZodInfer<typeof VerifyOtpSchema>;

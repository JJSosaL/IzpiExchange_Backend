import { email, object, string, type infer as ZodInfer } from 'zod';

const OTP_LENGTH = 6;

export const SignUpSchema = object(
	{
		email: email('El correo electrónico debe tener un formato válido'),
	},
	'El cuerpo de la petición debe ser un objeto',
);

export const VerifySignUpOtpSchema = object(
	{
		otp: string('El código OTP debe ser una cadena de texto').length(
			OTP_LENGTH,
			'El código OTP debe tener 6 caracteres',
		),
	},
	'El cuerpo de la petición debe ser un objeto',
);

export type SignUpSchemaDto = ZodInfer<typeof SignUpSchema>;
export type VerifySignUpOtpSchemaDto = ZodInfer<typeof VerifySignUpOtpSchema>;

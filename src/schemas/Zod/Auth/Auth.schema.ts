import { email, enum as enum_, object, string, type infer as ZodInfer } from 'zod';
import { BODY_PAYLOAD_MUST_BE_OBJECT } from '../Shared/Shared.messages.js';
import {
	EMAIL_MUST_HAVE_VALID_FORMAT,
	OTP_ACTION_MUST_BE_ENUM,
	OTP_CODE_MUST_BE_STRING,
	OTP_CODE_MUST_HAVE_6_CHARACTERS,
	OTP_CODE_MUST_HAVE_VALID_FORMAT,
} from './Auth.messages.js';

export enum VerifyOtpAction {
	SignIn = 'SIGN_IN',
	SignUp = 'SIGN_UP',
}

const OTP_CHARACTERS_LENGTH = 6;
const OTP_FORMAT_REGEX = /^\d+$/;

export const SignInSchema = object(
	{
		email: email(EMAIL_MUST_HAVE_VALID_FORMAT),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export const SignUpSchema = object(
	{
		email: email(EMAIL_MUST_HAVE_VALID_FORMAT),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export const VerifyOtpSchema = object(
	{
		action: enum_(VerifyOtpAction, OTP_ACTION_MUST_BE_ENUM),
		otp: string(OTP_CODE_MUST_BE_STRING)
			.length(OTP_CHARACTERS_LENGTH, OTP_CODE_MUST_HAVE_6_CHARACTERS)
			.regex(OTP_FORMAT_REGEX, OTP_CODE_MUST_HAVE_VALID_FORMAT),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export type SignInSchemaDto = ZodInfer<typeof SignInSchema>;
export type SignUpSchemaDto = ZodInfer<typeof SignUpSchema>;

export type VerifyOtpSchemaDto = ZodInfer<typeof VerifyOtpSchema>;

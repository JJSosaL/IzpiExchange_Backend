import { email, enum as enum_, object, string, type infer as ZodInfer } from 'zod';
import { OneTimePasswordAction } from '#schemas/MongoDB/OneTimePassword/OneTimePassword.types.js';
import { BODY_PAYLOAD_MUST_BE_OBJECT } from '../Shared/Shared.messages.js';
import {
	EMAIL_MUST_HAVE_VALID_FORMAT,
	OTP_ACTION_MUST_BE_ENUM,
	OTP_CODE_MUST_BE_STRING,
	OTP_CODE_MUST_HAVE_6_CHARACTERS,
	OTP_CODE_MUST_HAVE_VALID_FORMAT,
} from './Auth.messages.js';

const OTP_CHARACTERS_LENGTH = 6;
const OTP_FORMAT_REGEX = /^\d+$/;

export const SignInSchema = object(
	{
		email: email(EMAIL_MUST_HAVE_VALID_FORMAT).toLowerCase(),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export const SignUpSchema = object(
	{
		email: email(EMAIL_MUST_HAVE_VALID_FORMAT).toLowerCase(),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export const VerifyOneTimePasswordSchema = object(
	{
		action: enum_(OneTimePasswordAction, OTP_ACTION_MUST_BE_ENUM),
		otpCode: string(OTP_CODE_MUST_BE_STRING)
			.length(OTP_CHARACTERS_LENGTH, OTP_CODE_MUST_HAVE_6_CHARACTERS)
			.regex(OTP_FORMAT_REGEX, OTP_CODE_MUST_HAVE_VALID_FORMAT),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export type SignInDto = ZodInfer<typeof SignInSchema>;
export type SignUpDto = ZodInfer<typeof SignUpSchema>;

export type VerifyOneTimePasswordDto = ZodInfer<typeof VerifyOneTimePasswordSchema>;

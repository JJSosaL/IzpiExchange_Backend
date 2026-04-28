import { object, string, type infer as ZodInfer } from 'zod';
import { BODY_PAYLOAD_MUST_BE_OBJECT } from '../Shared/Shared.messages.js';
import { VERSION_MUST_BE_STRING, VERSION_MUST_HAVE_VALID_FORMAT } from './App.message.js';

const SEMVER_REGEX =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const CheckVersionSchema = object(
	{
		version: string(VERSION_MUST_BE_STRING).regex(SEMVER_REGEX, VERSION_MUST_HAVE_VALID_FORMAT),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export type CheckVersionDto = ZodInfer<typeof CheckVersionSchema>;

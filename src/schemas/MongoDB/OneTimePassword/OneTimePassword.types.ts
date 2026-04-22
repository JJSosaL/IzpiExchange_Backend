import type { HydratedDocument } from 'mongoose';
import type { OneTimePassword } from './OneTimePassword.schema.js';

export type OneTimePasswordDocument = HydratedDocument<OneTimePassword>;

export enum OneTimePasswordAction {
	SignIn = 'SIGN_IN',
	SignUp = 'SIGN_UP',
}

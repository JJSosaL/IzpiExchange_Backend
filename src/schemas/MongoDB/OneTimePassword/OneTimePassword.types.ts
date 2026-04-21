import type { HydratedDocument } from 'mongoose';
import type { OneTimePassword } from './OneTimePassword.js';

export type OneTimePasswordDocument = HydratedDocument<OneTimePassword>;

export enum OneTimePasswordAction {
	SignIn = 'SIGN_IN',
	SignOut = 'SIGN_OUT',
	SignUp = 'SIGN_UP',
}

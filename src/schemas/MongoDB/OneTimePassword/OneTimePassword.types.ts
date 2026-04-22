import type { HydratedDocument, Model } from 'mongoose';
import type { OneTimePassword } from './OneTimePassword.schema.js';

export type OneTimePasswordDocument = HydratedDocument<OneTimePassword>;
export type OneTimePasswordModel = Model<OneTimePassword>;

export enum OneTimePasswordAction {
	SignIn = 'SIGN_IN',
	SignUp = 'SIGN_UP',
}

export enum OneTimePasswordStatus {
	Consumed = 'CONSUMED',
	Pending = 'PENDING',
	Verified = 'VERIFIED',
}

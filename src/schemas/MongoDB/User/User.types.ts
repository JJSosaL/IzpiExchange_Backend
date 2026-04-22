import type { HydratedDocument, Model } from 'mongoose';
import type { User } from './User.schema.js';

export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;

export enum UserRole {
	Manager = 'MANAGER',
	Normal = 'NORMAL',
}

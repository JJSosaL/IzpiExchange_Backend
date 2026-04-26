import type { HydratedDocument, Model } from 'mongoose';
import type { Properties } from '#lib/Types/Util.js';
import type { User } from './User.schema.js';

export type UserDocument = HydratedDocument<User>;
export type UserDto = Properties<User>;
export type UserModel = Model<User>;

export enum UserRole {
	Manager = 'MANAGER',
	Normal = 'NORMAL',
}

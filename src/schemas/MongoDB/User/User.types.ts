import type { HydratedDocument } from 'mongoose';
import type { User } from './User.schema.js';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
	Manager = 'MANAGER',
	Normal = 'NORMAL',
}

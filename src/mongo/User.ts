import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export enum UserRole {
	Manager = 'MANAGER',
	Normal = 'NORMAL',
}

@Schema({
	timestamps: true,
})
export class User {
	@Prop({
		default: 100,
		required: true,
	})
	declare credits: number;

	@Prop({
		required: true,
	})
	declare email: string;

	@Prop({
		required: true,
		unique: true,
	})
	declare id: string;

	@Prop({
		default: UserRole.Normal,
		enum: UserRole,
		required: true,
	})
	declare role: UserRole;

	@Prop({
		required: true,
	})
	declare username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

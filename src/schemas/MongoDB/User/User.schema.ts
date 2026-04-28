import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from './User.types.js';

@Schema({
	timestamps: true,
})
export class User {
	@Prop({
		default: 100,
		required: true,
		type: Number,
	})
	declare credits: number;

	@Prop({
		required: true,
		type: String,
	})
	declare email: string;

	@Prop({
		required: true,
		type: String,
		unique: true,
	})
	declare id: string;

	@Prop({
		default: UserRole.Normal,
		enum: UserRole,
		required: true,
		type: UserRole,
	})
	declare role: UserRole;

	@Prop({
		required: true,
		type: String,
	})
	declare username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

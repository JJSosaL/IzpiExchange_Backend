import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({
	timestamps: true,
})
export class Account {
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
		required: true,
	})
	declare username: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

export type AccountDocument = HydratedDocument<Account>;

import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { OneTimePasswordAction, OneTimePasswordStatus } from './OneTimePassword.types.js';

@Schema({
	timestamps: true,
})
export class OneTimePassword {
	@Prop({
		enum: OneTimePasswordAction,
		required: true,
		type: OneTimePasswordAction,
	})
	declare action: OneTimePasswordAction;

	@Prop({
		required: true,
		type: String,
	})
	declare email: string;

	@Prop({
		expires: 0,
		required: true,
		type: Number,
	})
	declare expiresIn: Date;

	@Virtual({
		get: function (this: OneTimePassword) {
			return Date.now() > this.expiresIn.getTime();
		},
	})
	declare hasAlreadyExpired: boolean;

	@Prop({
		required: true,
		type: String,
		unique: true,
	})
	declare otpCode: string;

	@Prop({
		default: OneTimePasswordStatus.Pending,
		enum: OneTimePasswordStatus,
		required: true,
		type: OneTimePasswordStatus,
	})
	declare status: OneTimePasswordStatus;
}

export const OneTimePasswordSchema = SchemaFactory.createForClass(OneTimePassword);

import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { OneTimePasswordAction } from './OneTimePassword.types.js';

@Schema({
	timestamps: true,
})
export class OneTimePassword {
	@Prop({
		enum: OneTimePasswordAction,
		required: true,
	})
	declare action: OneTimePasswordAction;

	@Prop({
		required: true,
	})
	declare email: string;

	@Prop({
		expires: 0,
		required: true,
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
		unique: true,
	})
	declare otpCode: string;
}

export const OneTimePasswordSchema = SchemaFactory.createForClass(OneTimePassword);

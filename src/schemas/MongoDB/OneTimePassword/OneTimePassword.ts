import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';

@Schema({
	timestamps: true,
})
export class OneTimePassword {
	@Prop({
		required: true,
	})
	declare email: string;

	@Prop({
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
	declare otp: string;
}

export const OneTimePasswordSchema = SchemaFactory.createForClass(OneTimePassword);

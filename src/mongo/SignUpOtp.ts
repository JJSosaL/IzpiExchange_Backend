import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({
	timestamps: true,
})
export class SignUpOtp {
	@Prop({
		required: true,
	})
	declare email: string;

	@Prop({
		required: true,
	})
	declare expiresIn: Date;

	@Virtual({
		get: function (this: SignUpOtp) {
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

export const SignUpOtpSchema = SchemaFactory.createForClass(SignUpOtp);

export type SignUpOtpDocument = HydratedDocument<SignUpOtp>;

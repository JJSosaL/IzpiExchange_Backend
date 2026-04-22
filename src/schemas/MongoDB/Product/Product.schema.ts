import { Prop, Schema } from '@nestjs/mongoose';
import { ProductStatus } from './Product.types.js';

@Schema({
	timestamps: true,
})
export class Product {
	@Prop({
		required: true,
	})
	declare description: string;

	@Prop({
		required: true,
		unique: true,
	})
	declare id: string;

	@Prop({
		required: true,
	})
	declare name: string;

	@Prop({
		required: true,
	})
	declare price: number;

	@Prop({
		required: true,
	})
	declare publisherId: string;

	@Prop({
		enum: ProductStatus,
		required: true,
	})
	declare status: ProductStatus;
}

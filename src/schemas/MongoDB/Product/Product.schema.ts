import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductStatus } from './Product.types.js';

@Schema({
	timestamps: true,
})
export class Product {
	@Prop({
		required: true,
		type: String,
	})
	declare description: string;

	@Prop({
		required: true,
		type: String,
		unique: true,
	})
	declare id: string;

	@Prop({
		required: true,
		type: String,
	})
	declare name: string;

	@Prop({
		required: true,
		type: Number,
	})
	declare price: number;

	@Prop({
		required: true,
		type: String,
	})
	declare publisherId: string;

	@Prop({
		default: ProductStatus.Pending,
		enum: ProductStatus,
		required: true,
		type: String,
	})
	declare status: ProductStatus;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

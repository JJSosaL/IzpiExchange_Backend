import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JsonWebTokenModule } from '#modules/JsonWebToken/JsonWebToken.module.js';
import { UsersModule } from '#modules/Users/Users.module.js';
import { Product, ProductSchema } from '#root/schemas/MongoDB/Product/Product.schema.js';
import { ProductsController } from './Products.controller.js';

@Module({
	controllers: [
		ProductsController,
	],
	imports: [
		JsonWebTokenModule,
		MongooseModule.forFeature([
			{
				name: Product.name,
				schema: ProductSchema,
			},
		]),
		UsersModule,
	],
})
export class ProductsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JsonWebTokenModule } from '#modules/JsonWebToken/JsonWebToken.module.js';
import { RealTimeModule } from '#modules/RealTime/RealTime.module.js';
import { S3Module } from '#modules/S3/S3.module.js';
import { UsersModule } from '#modules/Users/Users.module.js';
import { Product, ProductSchema } from '#root/schemas/MongoDB/Product/Product.schema.js';
import { ProductsController } from './Products.controller.js';
import { ProductsService } from './Products.service.js';

@Module({
	controllers: [
		ProductsController,
	],
	exports: [
		ProductsService,
	],
	imports: [
		JsonWebTokenModule,
		MongooseModule.forFeature([
			{
				name: Product.name,
				schema: ProductSchema,
			},
		]),
		RealTimeModule,
		S3Module,
		UsersModule,
	],
	providers: [
		ProductsService,
	],
})
export class ProductsModule {}

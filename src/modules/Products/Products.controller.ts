import { randomUUID } from 'node:crypto';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '#common/Decorators/User.decorator.js';
import { AuthGuard } from '#common/Guards/Auth.guard.js';
import { ZodValidationPipe } from '#common/Pipes/ZodValidation.pipe.js';
import { USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE_RESPONSE } from '#lib/Responses/Products.js';
import { INTERNAL_SERVER_ERROR_RESPONSE } from '#lib/Responses/Shared.js';
import { UsersService } from '#modules/Users/Users.service.js';
import {
	type ProductCreateDto,
	ProductCreateSchema,
} from '#root/schemas/Zod/Product/Product.schema.js';
import { Product } from '#schemas/MongoDB/Product/Product.schema.js';
import { type ProductModel, ProductStatus } from '#schemas/MongoDB/Product/Product.types.js';
import type { UserDocument } from '#schemas/MongoDB/User/User.types.js';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
	public constructor(
		@InjectModel(Product.name) private readonly productModel: ProductModel,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	@Get()
	protected async getOwnProducts(@User() userDocument: UserDocument) {
		const { id } = userDocument;

		return await this.productModel
			.find({
				publisherId: id,
			}) // Ordenamos los productos por orden de 'actualizado recientemente'.
			.sort({
				updatedAt: -1,
			})
			.select({
				__v: false,
				_id: false,
			});
	}

	@Get('published')
	protected async getPublishedProducts() {
		return await this.productModel
			.find({
				status: ProductStatus.Published,
			})
			// Ordenamos los productos por orden de 'actualizado recientemente'.
			.sort({
				updatedAt: -1,
			})
			.select({
				__v: false,
				_id: false,
			});
	}

	@Post('publish')
	protected async publishProduct(
		@Body(new ZodValidationPipe(ProductCreateSchema)) productCreateData: ProductCreateDto,
		@User() userDocument: UserDocument,
	) {
		const { description, name, price } = productCreateData;
		const { credits, id } = userDocument;

		if (price > credits) {
			throw USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE_RESPONSE();
		}

		/*
		 * Decrementamos el precio del producto publicado del usuario que publicó el
		 * producto.
		 *
		 * Estos créditos se desbloquearan una vez el publicador haya vendido el
		 * producto.
		 */
		const creditsWereDecremented = await this.usersService.decrementCredits(id, price);

		if (!creditsWereDecremented) {
			throw INTERNAL_SERVER_ERROR_RESPONSE();
		}

		const productId = randomUUID();

		await this.productModel.create({
			description,
			id: productId,
			name,
			price,
			publisherId: id,
		});

		return {
			success: true,
		};
	}
}

import { randomUUID } from 'node:crypto';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '#common/Decorators/User.decorator.js';
import { AuthGuard } from '#common/Guards/Auth.guard.js';
import { ZodValidationPipe } from '#common/Pipes/ZodValidation.pipe.js';
import { USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE_RESPONSE } from '#lib/Responses/Products.js';
import { INTERNAL_SERVER_ERROR_RESPONSE } from '#lib/Responses/Shared.js';
import { UsersService } from '#modules/Users/Users.service.js';
import type { ProductModel } from '#root/schemas/MongoDB/Product/Product.types.js';
import type { UserDocument } from '#root/schemas/MongoDB/User/User.types.js';
import {
	type ProductCreateDto,
	ProductCreateSchema,
} from '#root/schemas/Zod/Product/Product.schema.js';
import { Product } from '#schemas/MongoDB/Product/Product.schema.js';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
	public constructor(
		@InjectModel(Product.name) private readonly productModel: ProductModel,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	@Post('publish')
	protected async handlePublish(
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

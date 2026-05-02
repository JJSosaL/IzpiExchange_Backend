import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NOT_FOUND_RESPONSE } from '#lib/Responses/Shared.js';
import { Product } from '#schemas/MongoDB/Product/Product.schema.js';
import { type ProductDocument, type ProductModel, ProductStatus } from '#schemas/MongoDB/Product/Product.types.js';

@Injectable()
export class ProductsService {
	public constructor(@InjectModel(Product.name) private readonly productModel: ProductModel) {}

	public async createProduct(options: CreateProductOptions): Promise<ProductDocument> {
		const { description, id, images, name, price, publisherId } = options;

		return await this.productModel.create({
			description,
			id,
			images,
			name,
			price,
			publisherId,
		});
	}

	public async getAllProducts(): Promise<ProductDocument[]> {
		return await this.productModel
			.find({
				status: ProductStatus.Published,
			})
			.sort({
				updatedAt: -1,
			})
			.select({
				__v: false,
				_id: false,
			});
	}

	public async getOwnProducts(userId: string): Promise<ProductDocument[]> {
		return await this.productModel
			.find({
				publisherId: userId,
			})
			.sort({
				updatedAt: -1,
			})
			.select({
				__v: false,
				_id: false,
			});
	}

	public async getProduct(productId: string): Promise<ProductDocument> {
		const productDocument = await this.productModel
			.findOne({
				id: productId,
			})
			.select({
				__v: false,
				_id: false,
			});

		if (!productDocument) {
			throw NOT_FOUND_RESPONSE();
		}

		return productDocument;
	}

	public async updateProductStatus(productId: string, status: ProductStatus): Promise<ProductDocument> {
		const productDocument = await this.productModel.findOneAndUpdate(
			{
				id: productId,
			},
			{
				status,
			},
			{
				projection: {
					__v: false,
					_id: false,
				},
				returnDocument: 'after',
			},
		);

		if (!productDocument) {
			throw NOT_FOUND_RESPONSE();
		}

		return productDocument;
	}
}

interface CreateProductOptions {
	description: string;
	id: string;
	images: string[];
	name: string;
	price: number;
	publisherId: string;
}

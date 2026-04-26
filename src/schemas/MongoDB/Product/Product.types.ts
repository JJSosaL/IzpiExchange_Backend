import type { HydratedDocument, Model } from 'mongoose';
import type { Properties } from '#lib/Types/Util.js';
import type { Product } from './Product.schema.js';

export type ProductDocument = HydratedDocument<Product>;
export type ProductDto = Properties<Product>;
export type ProductModel = Model<Product>;

export enum ProductStatus {
	Pending = 'PENDING',
	Published = 'PUBLISHED',
}

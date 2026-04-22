import type { HydratedDocument, Model } from 'mongoose';
import type { Product } from './Product.schema.js';

export type ProductDocument = HydratedDocument<Product>;
export type ProductModel = Model<Product>;

export enum ProductStatus {
	Approved = 'APPROVED',
	Pending = 'PENDING',
}

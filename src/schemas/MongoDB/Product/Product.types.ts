import type { HydratedDocument } from 'mongoose';
import type { Product } from './Product.schema.js';

export type ProductDocument = HydratedDocument<Product>;

export enum ProductStatus {
	Approved = 'APPROVED',
	Pending = 'PENDING',
}

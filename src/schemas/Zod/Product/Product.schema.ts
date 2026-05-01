import { coerce, enum as enum_, object, string, type infer as ZodInfer } from 'zod';
import { ProductStatus } from '#schemas/MongoDB/Product/Product.types.js';
import { BODY_PAYLOAD_MUST_BE_OBJECT } from '../Shared/Shared.messages.js';
import {
	PRODUCT_DESCRIPTION_MUST_BE_STRING,
	PRODUCT_DESCRIPTION_MUST_HAVE_MAX_LENGTH,
	PRODUCT_DESCRIPTION_MUST_HAVE_MIN_LENGTH,
	PRODUCT_NAME_MUST_BE_STRING,
	PRODUCT_NAME_MUST_HAVE_MAX_LENGTH,
	PRODUCT_NAME_MUST_HAVE_MIN_LENGTH,
	PRODUCT_PRICE_MUST_BE_INTEGER,
	PRODUCT_PRICE_MUST_BE_POSITIVE,
	PRODUCT_STATUS_MUST_BE_ENUM,
} from './Product.messages.js';

const PRODUCT_DESCRIPTION_MAX_LENGTH = 500;
const PRODUCT_DESCRIPTION_MIN_LENGTH = 10;

const PRODUCT_NAME_MAX_LENGTH = 50;
const PRODUCT_NAME_MIN_LENGTH = 5;

export const ProductCreateSchema = object(
	{
		description: string(PRODUCT_DESCRIPTION_MUST_BE_STRING)
			.min(
				PRODUCT_DESCRIPTION_MIN_LENGTH,
				PRODUCT_DESCRIPTION_MUST_HAVE_MIN_LENGTH(PRODUCT_DESCRIPTION_MIN_LENGTH),
			)
			.max(
				PRODUCT_DESCRIPTION_MAX_LENGTH,
				PRODUCT_DESCRIPTION_MUST_HAVE_MAX_LENGTH(PRODUCT_DESCRIPTION_MAX_LENGTH),
			),
		name: string(PRODUCT_NAME_MUST_BE_STRING)
			.min(
				PRODUCT_NAME_MIN_LENGTH,
				PRODUCT_NAME_MUST_HAVE_MIN_LENGTH(PRODUCT_NAME_MIN_LENGTH),
			)
			.max(
				PRODUCT_NAME_MAX_LENGTH,
				PRODUCT_NAME_MUST_HAVE_MAX_LENGTH(PRODUCT_NAME_MAX_LENGTH),
			),
		price: coerce
			.number(PRODUCT_PRICE_MUST_BE_INTEGER)
			.int(PRODUCT_PRICE_MUST_BE_INTEGER)
			.positive(PRODUCT_PRICE_MUST_BE_POSITIVE),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export const ProductStatusUpdateSchema = object(
	{
		status: enum_(ProductStatus, PRODUCT_STATUS_MUST_BE_ENUM),
	},
	BODY_PAYLOAD_MUST_BE_OBJECT,
);

export type ProductCreateDto = ZodInfer<typeof ProductCreateSchema>;
export type ProductStatusUpdateDto = ZodInfer<typeof ProductStatusUpdateSchema>;

export const PRODUCT_DESCRIPTION_MUST_BE_STRING = 'La descripción del producto debe ser una cadena de texto' as const;
export const PRODUCT_DESCRIPTION_MUST_HAVE_MAX_LENGTH = (maxLength: number) =>
	`La descripción del producto debe tener ${maxLength} caracteres como máximo` as const;
export const PRODUCT_DESCRIPTION_MUST_HAVE_MIN_LENGTH = (minLength: number) =>
	`La descripción del producto debe tener ${minLength} caracteres como mínimo` as const;

export const PRODUCT_NAME_MUST_BE_STRING = 'El nombre del producto debe ser una cadena de texto' as const;
export const PRODUCT_NAME_MUST_HAVE_MAX_LENGTH = (maxLength: number) =>
	`El nombre del producto debe tener ${maxLength} caracteres como máximo` as const;
export const PRODUCT_NAME_MUST_HAVE_MIN_LENGTH = (minLength: number) =>
	`El nombre del producto debe tener ${minLength} caracteres como mínimo` as const;

export const PRODUCT_PRICE_MUST_BE_INTEGER = 'El precio del producto debe ser un número entero' as const;
export const PRODUCT_PRICE_MUST_BE_POSITIVE = 'El precio del producto debe ser un número positivo' as const;

export const PRODUCT_STATUS_MUST_BE_ENUM = 'El estado del producto debe ser una enumeración' as const;

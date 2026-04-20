import { HttpException, type HttpStatus } from '@nestjs/common';

/**
 * Crea una instancia 'HttpException' para lanzarla en controladores de Nest.
 *
 * @param options - Las opciones para crear la instancia 'HttpException'.
 * @returns La instancia creada de 'HttpException'.
 */
export function buildHttpException(options: BuildHttpExceptionOptions): HttpException {
	const { data, statusCode } = options;

	return new HttpException(data, statusCode);
}

interface BuildHttpExceptionOptions {
	/**
	 * Los datos principales de la excepción.
	 */
	data: HttpExceptionData;
	/**
	 * El código HTTP de la excepción.
	 */
	statusCode: HttpStatus;
}

interface HttpExceptionData {
	/**
	 * El código identificador de la excepción.
	 */
	code: string;
	/**
	 * Detalles adicionales sobre la excepción.
	 */
	details?: Record<string, unknown>;
	/**
	 * El mensaje principal de la excepción.
	 */
	message: string;
}

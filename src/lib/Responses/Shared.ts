import { type HttpException, HttpStatus } from '@nestjs/common';
import { buildHttpException } from '#utils/Responses/buildHttpException.js';

export const FORBIDDEN_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'FORBIDDEN',
			message: '403: Prohibido',
		},
		statusCode: HttpStatus.FORBIDDEN,
	});

export const INTERNAL_SERVER_ERROR_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'INTERNAL_SERVER_ERROR',
			message: '500: Error Interno del Servidor',
		},
		statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
	});

export const NOT_FOUND_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'NOT_FOUND',
			message: '404: No Encontrado',
		},
		statusCode: HttpStatus.NOT_FOUND,
	});

export const UNAUTHORIZED_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'UNAUTHORIZED',
			message: '401: No Autorizado',
		},
		statusCode: HttpStatus.UNAUTHORIZED,
	});

export const UNPROCESSABLE_ENTITY_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'UNPROCESSABLE_ENTITY',
			message: '422: Entidad No Procesable',
		},
		statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
	});

export const ZOD_VALIDATION_ERROR_RESPONSE = (zodIssueMessage: string): HttpException =>
	buildHttpException({
		data: {
			code: 'ZOD_VALIDATION_ERROR',
			message: zodIssueMessage,
		},
		statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
	});

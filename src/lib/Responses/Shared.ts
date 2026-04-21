import { type HttpException, HttpStatus } from '@nestjs/common';
import { buildHttpException } from '#root/utils/Responses/buildHttpException.js';

export const INTERNAL_SERVER_ERROR = (): HttpException =>
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

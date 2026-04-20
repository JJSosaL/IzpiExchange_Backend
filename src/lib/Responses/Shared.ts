import { type HttpException, HttpStatus } from '@nestjs/common';
import { buildHttpException } from '#root/utils/Responses/buildHttpException.js';

export const NOT_FOUND_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'NOT_FOUND',
			message: '404: No Encontrado',
		},
		statusCode: HttpStatus.NOT_FOUND,
	});

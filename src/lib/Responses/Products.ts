import { type HttpException, HttpStatus } from '@nestjs/common';
import { buildHttpException } from '#root/utils/Responses/buildHttpException.js';

export const USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE',
			message:
				'Se debe tener una cantidad de créditos superior para publicar un producto con este precio',
		},
		statusCode: HttpStatus.BAD_REQUEST,
	});

import { type HttpException, HttpStatus } from '@nestjs/common';
import { buildHttpException } from '#root/utils/Responses/buildHttpException.js';

export const ACCOUNT_WITH_SAME_EMAIL_ALREADY_REGISTERED_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'ACCOUNT_WITH_SAME_EMAIL_ALREADY_REGISTERED',
			message: 'Ya existe una cuenta con este mismo correo electrónico registrado',
		},
		statusCode: HttpStatus.CONFLICT,
	});

export const EMAIL_DOMAIN_NOT_ALLOWED_RESPONSE = (): HttpException =>
	buildHttpException({
		data: {
			code: 'EMAIL_DOMAIN_NOT_ALLOWED',
			message: 'El dominio del correo electrónico específicado no está permitido',
		},
		statusCode: HttpStatus.FORBIDDEN,
	});

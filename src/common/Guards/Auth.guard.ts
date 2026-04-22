import { type CanActivate, type ExecutionContext, Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UNAUTHORIZED_RESPONSE } from '#lib/Responses/Shared.js';
import { JsonWebTokenService } from '#modules/JsonWebToken/JsonWebToken.service.js';
import { UsersService } from '#modules/Users/Users.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(
		@Inject(JsonWebTokenService) private readonly jsonWebTokenService: JsonWebTokenService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpContext = context.switchToHttp();
		const httpRequest = httpContext.getRequest<Request>();

		const userId = await this.jsonWebTokenService.verify(httpRequest);
		const userDocument = await this.usersService.get(userId);

		if (!userDocument) {
			throw UNAUTHORIZED_RESPONSE();
		}

		/*
		 * Asignar el documento del usuario a la petición para después acceder a
		 * esta propiedad mediante el decorador de 'User'.
		 */
		httpRequest.user = userDocument;

		return true;
	}
}

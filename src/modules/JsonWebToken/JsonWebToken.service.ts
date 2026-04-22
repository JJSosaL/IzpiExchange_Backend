import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UNAUTHORIZED_RESPONSE } from '#lib/Responses/Shared.js';
import type { JsonWebTokenPayload } from '#lib/Types/JsonWebToken.js';

@Injectable()
export class JsonWebTokenService {
	public constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

	public async sign(userId: string): Promise<string> {
		return await this.jwtService.signAsync({
			userId,
		});
	}

	public async verify(request: Request): Promise<string> {
		const authorizationHeader = request.get('Authorization') ?? '';
		const authorizationPayload = await this.jwtService
			.verifyAsync<JsonWebTokenPayload>(authorizationHeader)
			.catch(() => null);

		if (!authorizationPayload) {
			throw UNAUTHORIZED_RESPONSE();
		}

		const { userId } = authorizationPayload;

		return userId;
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UNAUTHORIZED_RESPONSE } from '#lib/Responses/Shared.js';
import type { JsonWebTokenPayload } from '#lib/Types/JsonWebToken.js';

@Injectable()
export class JsonWebTokenService {
	public constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

	private getAccessToken(requestOrAccessToken: Request | string): string {
		if (typeof requestOrAccessToken === 'string') {
			return requestOrAccessToken;
		}

		return requestOrAccessToken.get('Authorization') ?? '';
	}

	public async sign(userId: string): Promise<string> {
		return await this.jwtService.signAsync({
			userId,
		});
	}

	public async verify(
		requestOrAccessToken: Request | string,
		shouldThrow?: false,
	): Promise<string | null>;

	public async verify(requestOrAccessToken: Request | string, shouldThrow: true): Promise<string>;

	public async verify(
		requestOrAccessToken: Request | string,
		shouldThrow?: boolean,
	): Promise<string | null> {
		const accessToken = this.getAccessToken(requestOrAccessToken);
		const accessTokenPayload = await this.jwtService
			.verifyAsync<JsonWebTokenPayload>(accessToken)
			.catch(() => null);

		if (!accessTokenPayload) {
			if (!shouldThrow) {
				return null;
			}

			throw UNAUTHORIZED_RESPONSE();
		}

		const { userId } = accessTokenPayload;

		return userId;
	}
}

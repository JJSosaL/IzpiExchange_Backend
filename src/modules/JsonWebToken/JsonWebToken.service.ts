import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { match, P } from 'ts-pattern';
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

	public async verify(requestOrAccessToken: Request | string, throwUnauthorized?: false): Promise<string | null>;
	public async verify(requestOrAccessToken: Request | string, throwUnauthorized: true): Promise<string>;

	public async verify(requestOrAccessToken: Request | string, throwUnauthorized?: boolean): Promise<string | null> {
		const accessToken = this.getAccessToken(requestOrAccessToken);
		const accessTokenPayload = await this.jwtService.verifyAsync<JsonWebTokenPayload>(accessToken).catch(() => null);

		return match(accessTokenPayload)
			.returnType<string | null>()
			.with(P.nullish, () => {
				if (throwUnauthorized) {
					throw UNAUTHORIZED_RESPONSE();
				}

				return null;
			})
			.otherwise(({ userId }) => userId);
	}
}

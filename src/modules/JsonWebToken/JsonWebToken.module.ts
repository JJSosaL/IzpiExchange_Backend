import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET } from '#root/config.js';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: JWT_SECRET,
			signOptions: {
				algorithm: 'HS512',
				audience: JWT_AUDIENCE,
				expiresIn: '1d',
				issuer: JWT_ISSUER,
			},
			verifyOptions: {
				algorithms: [
					'HS512',
				],
				audience: JWT_AUDIENCE,
				issuer: JWT_ISSUER,
			},
		}),
	],
})
export class JsonWebTokenModule {}

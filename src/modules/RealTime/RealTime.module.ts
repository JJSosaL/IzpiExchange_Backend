import { Module } from '@nestjs/common';
import { JsonWebTokenModule } from '#modules/JsonWebToken/JsonWebToken.module.js';
import { UsersModule } from '#modules/Users/Users.module.js';
import { RealTimeGateway } from './RealTime.gateway.js';

@Module({
	imports: [
		JsonWebTokenModule,
		UsersModule,
	],
	providers: [
		RealTimeGateway,
	],
})
export class RealTimeModule {}

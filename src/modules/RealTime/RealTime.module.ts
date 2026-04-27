import { Module } from '@nestjs/common';
import { RealTimeGateway } from './RealTime.gateway.js';

@Module({
	providers: [
		RealTimeGateway,
	],
})
export class RealTimeModule {}

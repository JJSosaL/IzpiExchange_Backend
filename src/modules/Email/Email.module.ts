import { Module } from '@nestjs/common';
import { EmailService } from './Email.service.js';

@Module({
	exports: [
		EmailService,
	],
	providers: [
		EmailService,
	],
})
export class EmailModule {}

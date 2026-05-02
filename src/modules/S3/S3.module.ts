import { Module } from '@nestjs/common';
import { S3Service } from './S3.service.js';

@Module({
	exports: [
		S3Service,
	],
	providers: [
		S3Service,
	],
})
export class S3Module {}

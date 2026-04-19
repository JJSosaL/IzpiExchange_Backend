import { Module } from '@nestjs/common';
import { AuthModule } from './Auth/Auth.module.js';

@Module({
	imports: [
		AuthModule,
	],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MONGO_DB_CONNECTION_URL, MONGO_DB_DATABASE_NAME } from '#root/config.js';
import { AuthModule } from './Auth/Auth.module.js';

@Module({
	imports: [
		AuthModule,
		MongooseModule.forRoot(MONGO_DB_CONNECTION_URL, {
			dbName: MONGO_DB_DATABASE_NAME,
		}),
		ScheduleModule.forRoot(),
	],
})
export class AppModule {}

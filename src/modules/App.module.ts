import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_CONNECTION_URL, MONGO_DB_DATABASE_NAME } from '#root/config.js';
import { AppController } from './App.controller.js';
import { AuthModule } from './Auth/Auth.module.js';
import { ProductsModule } from './Products/Products.module.js';
import { RealTimeModule } from './RealTime/RealTime.module.js';
import { UsersModule } from './Users/Users.module.js';

@Module({
	controllers: [
		AppController,
	],
	imports: [
		AuthModule,
		MongooseModule.forRoot(MONGO_DB_CONNECTION_URL, {
			dbName: MONGO_DB_DATABASE_NAME,
		}),
		ProductsModule,
		RealTimeModule,
		UsersModule,
	],
})
export class AppModule {}

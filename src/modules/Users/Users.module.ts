import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '#schemas/MongoDB/User/User.schema.js';
import { UsersService } from './Users.service.js';

@Module({
	exports: [
		UsersService,
	],
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	providers: [
		UsersService,
	],
})
export class UsersModule {}

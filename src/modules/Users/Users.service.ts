import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { User } from '#schemas/MongoDB/User/User.schema.js';
import type { UserDocument } from '#schemas/MongoDB/User/User.types.js';

@Injectable()
export class UsersService {
	public constructor(@InjectModel(User.name) private readonly usersModel: Model<User>) {}

	public async getUser(id: string): Promise<UserDocument | null> {
		return await this.usersModel.findOne({
			id,
		});
	}
}

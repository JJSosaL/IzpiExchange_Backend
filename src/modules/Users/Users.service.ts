import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '#schemas/MongoDB/User/User.schema.js';
import type { UserDocument, UserModel } from '#schemas/MongoDB/User/User.types.js';

@Injectable()
export class UsersService {
	public constructor(@InjectModel(User.name) private readonly usersModel: UserModel) {}

	private async updateUserCredits(userId: string, amount: number): Promise<boolean> {
		return await this.usersModel
			.findOneAndUpdate(
				{
					id: userId,
				},
				{
					$inc: {
						credits: amount,
					},
				},
			)
			.then(() => true)
			.catch(() => false);
	}

	public async decrementCredits(userId: string, amount: number): Promise<boolean> {
		return await this.updateUserCredits(userId, -amount);
	}

	public async incrementCredits(userId: string, amount: number): Promise<boolean> {
		return await this.updateUserCredits(userId, amount);
	}

	public async get(id: string): Promise<UserDocument | null> {
		return await this.usersModel.findOne({
			id,
		});
	}
}

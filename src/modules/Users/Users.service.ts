import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { match, P } from 'ts-pattern';
import { UNAUTHORIZED_RESPONSE } from '#lib/Responses/Shared.js';
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

	public async getUser(userId: string, throwUnauthorized?: false): Promise<UserDocument | null>;
	public async getUser(userId: string, throwUnauthorized: true): Promise<UserDocument>;

	public async getUser(
		userId: string,
		throwUnauthorized?: boolean,
	): Promise<UserDocument | null> {
		const userDocument = await this.usersModel.findOne({
			id: userId,
		});

		return match(userDocument)
			.returnType<UserDocument | null>()
			.with(P.nullish, () => {
				if (throwUnauthorized) {
					throw UNAUTHORIZED_RESPONSE();
				}

				return null;
			})
			.otherwise((userDocument) => userDocument);
	}
}

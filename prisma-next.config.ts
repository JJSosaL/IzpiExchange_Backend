import 'dotenv/config';
import { env } from 'node:process';
import MongoAdapter from '@prisma-next/adapter-mongo/control';
import { defineConfig } from '@prisma-next/cli/config-types';
import MongoDriver from '@prisma-next/driver-mongo/control';
import { mongoFamilyDescriptor, mongoTargetDescriptor } from '@prisma-next/family-mongo/control';
import { mongoContract } from '@prisma-next/mongo-contract-psl/provider';

const { MONGO_DB_CONNECTION_URL } = env;

export default defineConfig({
	adapter: MongoAdapter,
	contract: mongoContract('./prisma/contract.prisma', {
		output: 'src/contract.json',
	}),
	db: {
		connection: MONGO_DB_CONNECTION_URL,
	},
	driver: MongoDriver,
	family: mongoFamilyDescriptor,
	target: mongoTargetDescriptor,
});

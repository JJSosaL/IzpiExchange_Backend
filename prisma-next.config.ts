import 'dotenv/config';
import MongoAdapter from '@prisma-next/adapter-mongo/control';
import { defineConfig } from '@prisma-next/cli/config-types';
import MongoDriver from '@prisma-next/driver-mongo/control';
import { mongoFamilyDescriptor, mongoTargetDescriptor } from '@prisma-next/family-mongo/control';
import { mongoContract } from '@prisma-next/mongo-contract-psl/provider';
import { getEnvironmentVariable } from '#utils/Process/getEnvironmentVariable.js';

export default defineConfig({
	adapter: MongoAdapter,
	contract: mongoContract('./prisma/contract.prisma', {
		output: 'src/contract.json',
	}),
	db: {
		connection: getEnvironmentVariable('MONGO_DB_CONNECTION_URL'),
	},
	driver: MongoDriver,
	family: mongoFamilyDescriptor,
	target: mongoTargetDescriptor,
});

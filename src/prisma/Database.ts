import { createMongoAdapter } from '@prisma-next/adapter-mongo';
import { createMongoDriver } from '@prisma-next/driver-mongo';
import { validateMongoContract } from '@prisma-next/mongo-contract';
import { mongoOrm } from '@prisma-next/mongo-orm';
import { createMongoRuntime } from '@prisma-next/mongo-runtime';
import { MONGO_DB_CONNECTION_URL, MONGO_DB_DATABASE_NAME } from '#root/config.js';
import type { Contract } from '../contract.d.ts';
/*
 * biome-ignore lint/correctness/useImportExtensions: Esta importación debe
 * ser explícitamente '.json'.
 */
import ContractJson from '../contract.json' with { type: 'json' };

const { contract } = validateMongoContract<Contract>(ContractJson);

const MongoAdapter = createMongoAdapter();
const MongoDriver = await createMongoDriver(MONGO_DB_CONNECTION_URL, MONGO_DB_DATABASE_NAME);

const MongoRuntime = createMongoRuntime({
	adapter: MongoAdapter,
	contract,
	driver: MongoDriver,
	targetId: 'mongo',
});

export const MongoOrm = mongoOrm<Contract>({
	contract,
	executor: MongoRuntime,
});

import { randomUUID } from 'node:crypto';
import { ObjectCannedACL, type PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR_RESPONSE } from '#lib/Responses/Shared.js';
import { S3_ACCESS_ID, S3_ACCESS_SECRET, S3_BUCKET_ID, S3_BUCKET_PUBLIC_URL } from '#root/config.js';

@Injectable()
export class S3Service {
	private static S3_ACCESS_ID = S3_ACCESS_ID;
	private static S3_ACCESS_SECRET = S3_ACCESS_SECRET;

	private static S3_BUCKET_ID = S3_BUCKET_ID;
	private static S3_BUCKET_PUBLIC_URL = S3_BUCKET_PUBLIC_URL;

	private static MAXIMUM_REQUEST_TIMEOUT = 15_000 as const;

	private readonly s3Client: S3;

	public constructor() {
		this.s3Client = new S3({
			credentials: {
				accessKeyId: S3Service.S3_ACCESS_ID,
				secretAccessKey: S3Service.S3_ACCESS_SECRET,
			},
			endpoint: 'https://sfo3.digitaloceanspaces.com',
			forcePathStyle: false,
			region: 'auto',
		});
	}

	public async putObject(productId: string, file: MulterFile): Promise<string> {
		const { buffer, mimetype } = file;

		const objectKey = `products/${productId}/${randomUUID()}`;
		const objectParams: PutObjectCommandInput = {
			/*
			 * biome-ignore-start lint/style/useNamingConvention: Esta convención
			 * proviene de un paquete externo que no se puede sobrescribir.
			 */
			ACL: ObjectCannedACL.public_read,
			Body: buffer,
			Bucket: S3Service.S3_BUCKET_ID,
			ContentType: mimetype,
			Key: objectKey,
			/*
			 * biome-ignore-end lint/style/useNamingConvention: Esta convención
			 * proviene de un paquete externo que no se puede sobrescribir.
			 */
		};

		try {
			await this.s3Client.putObject(objectParams, {
				abortSignal: AbortSignal.timeout(S3Service.MAXIMUM_REQUEST_TIMEOUT),
			});

			return `https://${S3Service.S3_BUCKET_PUBLIC_URL}/${objectKey}`;
		} catch (error) {
			Logger.error({
				error,
			});

			throw INTERNAL_SERVER_ERROR_RESPONSE();
		}
	}
}

type MulterFile = Express.Multer.File;

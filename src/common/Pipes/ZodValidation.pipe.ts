import { HttpStatus, Injectable, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';
import { buildHttpException } from '#root/utils/Responses/buildHttpException.js';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	public constructor(private readonly zodSchema: ZodType) {
		this.zodSchema = zodSchema;
	}

	public transform(value: unknown) {
		const result = this.zodSchema.safeParse(value);
		const { success, data } = result;

		if (!success) {
			const { error } = result;
			const { issues } = error;

			const message = issues[0].message;

			throw buildHttpException({
				data: {
					code: 'INPUT_DATA_VALIDATION_FAILED',
					message,
				},
				statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			});
		}

		return data;
	}
}

import { HttpException, HttpStatus, Injectable, type PipeTransform } from '@nestjs/common';
import type z from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	private readonly zodSchema: z.ZodType;

	public constructor(zodSchema: z.ZodType) {
		this.zodSchema = zodSchema;
	}

	public transform(value: unknown) {
		const result = this.zodSchema.safeParse(value);
		const { success, data } = result;

		if (!success) {
			const { error } = result;
			const { issues } = error;

			const message = issues[0].message;

			throw new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return data;
	}
}

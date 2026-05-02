import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const User = createParamDecorator((_: unknown, context: ExecutionContext) => {
	const httpContext = context.switchToHttp();
	const httpRequest = httpContext.getRequest<Request>();

	const user = httpRequest.user;

	return user;
});

import { Inject } from '@nestjs/common';
import {
	ConnectedSocket,
	type OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JsonWebTokenService } from '#modules/JsonWebToken/JsonWebToken.service.js';
import { UsersService } from '#modules/Users/Users.service.js';
import type { UserRole } from '#schemas/MongoDB/User/User.types.js';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: 'gateway',
})
export class RealTimeGateway implements OnGatewayConnection {
	@WebSocketServer()
	public declare readonly server: Server;

	public constructor(
		@Inject(JsonWebTokenService)
		private readonly jsonWebTokenService: JsonWebTokenService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	broadcast<GatewayEvent extends GatewayEventName>(
		event: GatewayEvent,
		payload: unknown,
		role?: UserRole,
	): void {
		const { server } = this;

		if (role) {
			return void server.to(`role:${role}`).emit(event, payload);
		}

		server.emit(event, payload);
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const { handshake, id } = client;
		const { auth } = handshake;
		const { accessToken } = auth;

		console.log(`Gestionando cliente entrante: ${id}`);

		if (!accessToken) {
			return client.emit(
				GatewayEventName.AuthenticationFailed,
				null,
				() => client.disconnect(true),
			);
		}

		const userId = await this.jsonWebTokenService.verify(
			accessToken,
			false,
		);
		const userDocument = await this.usersService.getUser(userId ?? '');

		if (!userDocument) {
			return client.emit(
				GatewayEventName.AuthenticationFailed,
				null,
				() => client.disconnect(true),
			);
		}

		const { role } = userDocument;

		client.data.user = userDocument;
		client.join(`role:${role}`);

		console.log(`Un nuevo cliente ha sido conectado: ${id}`);
	}
}

export enum GatewayEventName {
	AuthenticationFailed = 'AUTHENTICATION_FAILED',
	ProductCreated = 'PRODUCT_CREATED',
	ProductPublished = 'PRODUCT_PUBLISHED',
}

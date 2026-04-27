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
import type { Product } from '#schemas/MongoDB/Product/Product.schema.js';
import type { UserRole } from '#schemas/MongoDB/User/User.types.js';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class RealTimeGateway implements OnGatewayConnection {
	@WebSocketServer()
	public declare readonly server: Server;

	public constructor(
		@Inject(JsonWebTokenService) private readonly jsonWebTokenService: JsonWebTokenService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	broadcast<GatewayEvent extends GatewayEventName>(
		event: GatewayEvent,
		payload: GatewayEventPayloadData[GatewayEvent],
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

		console.log(`Gestionando cliente entrante: ${id}`);

		const { accessToken } = auth;

		if (!accessToken) {
			return client.disconnect(true);
		}

		const userId = await this.jsonWebTokenService.verify(accessToken, false);
		const userDocument = await this.usersService.get(userId ?? '');

		if (!userDocument) {
			return client.disconnect(true);
		}

		const { role } = userDocument;

		client.data.user = userDocument;
		client.join(`role:${role}`);

		console.log(`Un nuevo cliente ha sido conectado: ${id}`);
	}
}

type GatewayEventPayloadData = {
	[GatewayEventName.ProductCreated]: Product;
	[GatewayEventName.ProductPublished]: Product;
};

export enum GatewayEventName {
	ProductCreated = 'PRODUCT_CREATED',
	ProductPublished = 'PRODUCT_PUBLISHED',
}

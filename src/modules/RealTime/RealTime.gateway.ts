import { Inject } from '@nestjs/common';
import {
	ConnectedSocket,
	type OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JsonWebTokenService } from '#modules/JsonWebToken/JsonWebToken.service.js';
import { UsersService } from '#modules/Users/Users.service.js';
import type { Product } from '#schemas/MongoDB/Product/Product.schema.js';

@WebSocketGateway()
export class RealTimeGateway implements OnGatewayConnection {
	public declare readonly server: Server;

	public constructor(
		@Inject(JsonWebTokenService) private readonly jsonWebTokenService: JsonWebTokenService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	broadcast<Event extends EventName>(event: Event, payload: EventPayloadData[Event]): void {
		this.server.emit(event, payload);
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const { handshake } = client;
		const { auth } = handshake;

		const { accessToken } = auth;

		if (!accessToken) {
			return client.disconnect(true);
		}

		const userId = await this.jsonWebTokenService.verify(accessToken, false);
		const userDocument = await this.usersService.get(userId ?? '');

		if (!userDocument) {
			return client.disconnect(true);
		}
	}

	@SubscribeMessage('message')
	handleMessage(@ConnectedSocket() client: Socket) {
		const { id } = client;

		console.log(`Un nuevo cliente ha sido conectado: ${id}`);
	}
}

type EventPayloadData = {
	[EventName.ProductPublished]: Product;
};

export enum EventName {
	ProductPublished = 'PRODUCT_PUBLISHED',
}

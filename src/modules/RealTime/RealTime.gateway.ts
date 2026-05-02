import { Inject, Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	type OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JsonWebTokenService } from '#modules/JsonWebToken/JsonWebToken.service.js';
import { UsersService } from '#modules/Users/Users.service.js';
import type { ProductDocument } from '#root/schemas/MongoDB/Product/Product.types.js';
import { UserRole } from '#root/schemas/MongoDB/User/User.types.js';

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

	private getRoomName(userRole: UserRole): string {
		const roomNames: Record<UserRole, string> = {
			[UserRole.Manager]: 'room:managers',
			[UserRole.Normal]: 'room:users',
		};

		return roomNames[userRole];
	}

	public emitProductPublished(product: ProductDocument): void {
		const { server } = this;

		server.emit(GatewayEventName.ProductPublished, product);
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const { handshake, id } = client;
		const { auth } = handshake;
		const { accessToken } = auth;

		Logger.log(`Gestionando cliente entrante: ${id}`);

		if (!accessToken) {
			return client.emit(
				GatewayEventName.AuthenticationFailed,
				null,
				() => {
					Logger.warn(
						`Cliente '${id}' desconectado: No contiene un token de acceso`,
					);
					client.disconnect(true);
				},
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
				() => {
					Logger.warn(
						`Cliente '${id}' desconectado: No existe el documento del usuario`,
					);
					client.disconnect(true);
				},
			);
		}

		const { role } = userDocument;

		client.data.user = userDocument;
		client.join(this.getRoomName(role));

		Logger.log(`Cliente conectado: ${id}`);
	}
}

export enum GatewayEventName {
	AuthenticationFailed = 'AUTHENTICATION_FAILED',
	ProductCreated = 'PRODUCT_CREATED',
	ProductPublished = 'PRODUCT_PUBLISHED',
}

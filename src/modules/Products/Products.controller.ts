import { randomUUID } from 'node:crypto';
import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	HttpStatus,
	Inject,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '#common/Decorators/User.decorator.js';
import { AuthGuard } from '#common/Guards/Auth.guard.js';
import { ZodValidationPipe } from '#common/Pipes/ZodValidation.pipe.js';
import { USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE_RESPONSE } from '#lib/Responses/Products.js';
import { FORBIDDEN_RESPONSE, INTERNAL_SERVER_ERROR_RESPONSE, UNPROCESSABLE_ENTITY_RESPONSE } from '#lib/Responses/Shared.js';
import { RealTimeGateway } from '#modules/RealTime/RealTime.gateway.js';
import { S3Service } from '#modules/S3/S3.service.js';
import { UsersService } from '#modules/Users/Users.service.js';
import { ProductStatus } from '#schemas/MongoDB/Product/Product.types.js';
import { type UserDocument, UserRole } from '#schemas/MongoDB/User/User.types.js';
import {
	type ProductCreateDto,
	ProductCreateSchema,
	type ProductStatusUpdateDto,
	ProductStatusUpdateSchema,
} from '#schemas/Zod/Product/Product.schema.js';
import { buildHttpException } from '#utils/Responses/buildHttpException.js';
import { ProductsService } from './Products.service.js';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
	private static MAXIMUM_PRODUCT_FILE_SIZE = 25_000_000 as const; // 25 MB
	private static MAXIMUM_PRODUCT_FILES_LENGTH = 5 as const;

	public constructor(
		@Inject(ProductsService) private readonly productsService: ProductsService,
		@Inject(RealTimeGateway) private readonly realTimeGateway: RealTimeGateway,
		@Inject(S3Service) private readonly s3Service: S3Service,
		@Inject(UsersService) private readonly usersService: UsersService,
	) {}

	@Post()
	@UseInterceptors(FilesInterceptor('images', ProductsController.MAXIMUM_PRODUCT_FILES_LENGTH))
	protected async createProduct(
		@Body(new ZodValidationPipe(ProductCreateSchema)) productCreateData: ProductCreateDto,
		@User() userDocument: UserDocument,
		@UploadedFiles(
			new ParseFilePipe({
				exceptionFactory: () =>
					buildHttpException({
						data: {
							code: 'FILES_ARE_REQUIRED',
							message: 'Se deben subir archivos',
						},
						statusCode: HttpStatus.BAD_REQUEST,
					}),
				validators: [
					new MaxFileSizeValidator({
						maxSize: ProductsController.MAXIMUM_PRODUCT_FILE_SIZE,
					}),
					new FileTypeValidator({
						fileType: /^image\/(png|jpeg|webp)$/,
					}),
				],
			}),
		)
		files: MulterFile[],
	) {
		const { description, name, price } = productCreateData;
		const { credits: userCredits, id: userId } = userDocument;

		if (price > userCredits) {
			throw USER_MUST_HAVE_HIGHER_BALANCE_THAN_PRICE_RESPONSE();
		}

		/*
		 * Decrementamos el precio del producto publicado del usuario que publicó el
		 * producto.
		 *
		 * Estos créditos se desbloquearan una vez el publicador haya vendido el
		 * producto.
		 */
		const creditsWereDecremented = await this.usersService.decrementCredits(userId, price);

		if (!creditsWereDecremented) {
			throw INTERNAL_SERVER_ERROR_RESPONSE();
		}

		const productId = randomUUID();

		const productImagePromises = await Promise.allSettled(files.map((file) => this.s3Service.putObject(productId, file)));
		const productImages = productImagePromises.filter((promise) => promise.status === 'fulfilled').map(({ value }) => value);

		const productDocument = await this.productsService.createProduct({
			description,
			id: productId,
			images: productImages,
			name,
			price,
			publisherId: userId,
		});

		this.realTimeGateway.emitProductCreated(productDocument);

		return productDocument;
	}

	@Get()
	protected async getAllProducts() {
		return await this.productsService.getAllProducts();
	}

	@Get('own')
	protected async getOwnProducts(@User() userDocument: UserDocument) {
		const { id } = userDocument;

		return await this.productsService.getOwnProducts(id);
	}

	@Get('pending')
	protected async getPendingProducts(@User() userDocument: UserDocument) {
		const { role } = userDocument;

		if (role !== UserRole.Manager) {
			throw FORBIDDEN_RESPONSE();
		}

		return await this.productsService.getPendingProducts();
	}

	@Get(':productId')
	protected async getProduct(@Param('productId') productId: string) {
		return await this.productsService.getProduct(productId);
	}

	@Patch(':productId/status')
	protected async updateProductStatus(
		@Body(new ZodValidationPipe(ProductStatusUpdateSchema)) productStatusUpdateData: ProductStatusUpdateDto,
		@Param('productId') productId: string,
		@User() userDocument: UserDocument,
	) {
		const { status } = productStatusUpdateData;
		const { role } = userDocument;

		if (role !== UserRole.Manager) {
			throw FORBIDDEN_RESPONSE();
		}

		if (status === ProductStatus.Pending) {
			throw UNPROCESSABLE_ENTITY_RESPONSE();
		}

		const productDocument = await this.productsService.updateProductStatus(productId, status);

		if (status === ProductStatus.Published) {
			this.realTimeGateway.emitProductPublished(productDocument);
		}

		return productDocument;
	}
}

type MulterFile = Express.Multer.File;

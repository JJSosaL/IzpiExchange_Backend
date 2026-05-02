import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Injectable, Logger } from '@nestjs/common';
import emailAddresses, { type ParsedMailbox } from 'email-addresses';
import Handlebars from 'handlebars';
import { createTransport, type Transporter } from 'nodemailer';
import {
	ALLOWED_EMAIL_DOMAIN,
	EMAIL_HOST_NAME,
	EMAIL_HOST_PORT,
	EMAIL_USER_NAME,
	EMAIL_USER_TOKEN,
} from '#root/config.js';

@Injectable()
export class EmailService {
	private static EMAIL_HOST = EMAIL_HOST_NAME;
	private static EMAIL_PORT = EMAIL_HOST_PORT;
	private static EMAIL_USER_NAME = EMAIL_USER_NAME;
	private static EMAIL_USER_TOKEN = EMAIL_USER_TOKEN;

	private readonly nodeMailer: Transporter;

	public constructor() {
		this.nodeMailer = createTransport({
			auth: {
				pass: EmailService.EMAIL_USER_TOKEN,
				user: EmailService.EMAIL_USER_NAME,
			},
			host: EmailService.EMAIL_HOST,
			port: EmailService.EMAIL_PORT,
			/*
			 * biome-ignore lint/style/useNamingConvention: Esta convención proviene de
			 * un paquete externo que no se puede sobrescribir.
			 */
			requireTLS: true,
		});

		this.nodeMailer
			.verify()
			.then(() => Logger.log('La configuración SMTP es correcta'))
			.catch((error) => console.error(error));
	}

	private createOneTimePasswordMail(
		templateFileName: `${string}.html`,
		options: Pick<CreateOneTimePasswordOptions, 'otpCode'>,
	): string {
		const { otpCode } = options;

		const handlebarsTemplatePath = join(
			cwd(),
			'templates',
			templateFileName,
		);
		const handlebarsTemplateContent = readFileSync(
			handlebarsTemplatePath,
			'utf-8',
		);

		const handlebarsTemplate = Handlebars.compile(
			handlebarsTemplateContent,
		)({
			otpCode,
		});

		return handlebarsTemplate;
	}

	public isValidEmailDomain(email: string): boolean {
		const { domain } = this.parseEmail(email);

		return domain === ALLOWED_EMAIL_DOMAIN;
	}

	public parseEmail(email: string): EmailData {
		const emailData = emailAddresses.parseOneAddress(
			email,
		) as ParsedMailbox | null;

		if (!emailData) {
			throw new TypeError(
				`Formato de correo eletrónico no válido: ${email}`,
			);
		}

		const { domain, local } = emailData;

		return {
			domain,
			username: local,
		};
	}

	public async sendSignInMail(options: SendSignInMailOptions): Promise<void> {
		const { recipient } = options;
		const oneTimePasswordHtml = this.createOneTimePasswordMail(
			'SignInOneTimePasswordMessage.html',
			options,
		);

		await this.nodeMailer.sendMail({
			encoding: 'utf-8',
			from: `IzpiExchange <${EmailService.EMAIL_USER_NAME}>`,
			html: oneTimePasswordHtml,
			subject: '📲 Código para Iniciar Sesión - IzpiExchange',
			to: recipient,
		});
	}

	public async sendSignUpMail(options: SendSignUpMailOptions): Promise<void> {
		const { recipient } = options;
		const oneTimePasswordHtml = this.createOneTimePasswordMail(
			'SignUpOneTimePasswordMessage.html',
			options,
		);

		await this.nodeMailer.sendMail({
			encoding: 'utf-8',
			from: `IzpiExchange <${EmailService.EMAIL_USER_NAME}>`,
			html: oneTimePasswordHtml,
			subject: '✅ Código de Verificación - IzpiExchange',
			to: recipient,
		});
	}
}

interface EmailData {
	domain: string;
	username: string;
}

interface CreateOneTimePasswordOptions {
	otpCode: string;
	recipient: string;
}

type SendSignInMailOptions = CreateOneTimePasswordOptions;
type SendSignUpMailOptions = CreateOneTimePasswordOptions;

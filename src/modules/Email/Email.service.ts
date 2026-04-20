import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Injectable } from '@nestjs/common';
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

		// Verificar que la configuración SMTP es correcta.
		this.nodeMailer
			.verify()
			.then(() => console.info('La configuración SMTP es correcta'))
			.catch((error) => console.error(error));
	}

	public isValidEmailDomain(email: string): boolean {
		const { domain } = this.parseEmail(email);

		return domain === ALLOWED_EMAIL_DOMAIN;
	}

	public async sendOneTimePasswordMail(options: SendOneTimePasswordMailOptions): Promise<void> {
		const { otpCode, recipient } = options;

		const handlebarsTemplatePath = join(cwd(), 'templates', 'OneTimePasswordMessage.html');
		const handlebarsTemplateContent = readFileSync(handlebarsTemplatePath, 'utf-8');

		const handlebarsTemplate = Handlebars.compile(handlebarsTemplateContent)({
			otpCode,
		});

		await this.nodeMailer.sendMail({
			encoding: 'utf-8',
			from: `"IzpiExchange" <${EmailService.EMAIL_USER_NAME}>`,
			html: handlebarsTemplate,
			priority: 'normal',
			subject: '✅ Código de Verificación - IzpiExchange',
			to: recipient,
		});
	}

	public parseEmail(email: string): EmailData {
		const emailData = emailAddresses.parseOneAddress(email) as ParsedMailbox | null;

		if (!emailData) {
			throw new TypeError(`Formato de correo eletrónico no válido: ${email}`);
		}

		const { domain, local } = emailData;

		return {
			domain,
			username: local,
		};
	}
}

interface EmailData {
	domain: string;
	username: string;
}

interface SendOneTimePasswordMailOptions {
	otpCode: string;
	recipient: string;
}

import { Body, Controller, Post } from '@nestjs/common';
import semver from 'semver';
import { ZodValidationPipe } from '#common/Pipes/ZodValidation.pipe.js';
import { type CheckVersionDto, CheckVersionSchema } from '#schemas/Zod/App/App.schema.js';
/*
 * biome-ignore lint/correctness/useImportExtensions: Esta importación debe
 * tener una extensión explícita '.json'.
 */
import pkg from '../../package.json' with { type: 'json' };

@Controller()
export class AppController {
	@Post('check-version')
	protected checkVersion(
		@Body(new ZodValidationPipe(CheckVersionSchema))
		checkVersionData: CheckVersionDto,
	) {
		const { version } = checkVersionData;
		const { version: pkgVersion } = pkg;

		return {
			shouldUpgrade: semver.gt(pkgVersion, version),
		};
	}
}

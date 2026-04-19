import type { Configuration } from 'lint-staged';

export default {
	'**/*.{js,ts,json,html,css}': 'pnpm biome:write',
} as Configuration;

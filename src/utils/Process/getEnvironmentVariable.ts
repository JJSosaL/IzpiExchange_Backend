import { env } from 'node:process';

export function getEnvironmentVariable(variableName: string): string {
	const variableValue = env[variableName];

	if (!variableValue) {
		throw new TypeError(
			`La variable de entorno '${variableName}' no está configurada`,
		);
	}

	return variableValue;
}

import { env } from 'node:process';

/**
 * Obtiene el valor de la variable de entorno específicada.
 *
 * @param variableName - El nombre de la variable de entorno a obtener.
 * @returns El valor de la variable de entorno.
 *
 * @remarks
 * Esta función lanza un error si la variable de entorno no tiene un valor o
 * no está configurada.
 */
export function getEnvironmentVariable(variableName: string): string {
	const variableValue = env[variableName];

	if (!variableValue) {
		throw new TypeError(`La variable de entorno '${variableName}' no está configurada`);
	}

	return variableValue;
}

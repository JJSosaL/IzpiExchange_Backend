import { getEnvironmentVariable } from '#utils/Process/getEnvironmentVariable.js';

/**
 * El dominio permitido para los correos electrónicos.
 *
 * Cualquier correo electrónico que no provenga de este dominio será rechazado
 * al momento de intentar crear una cuenta nueva.
 */
export const ALLOWED_EMAIL_DOMAIN = getEnvironmentVariable('ALLOWED_EMAIL_DOMAIN');

/**
 * El puerto en el que se ejecutará la aplicación de Nest.
 *
 * NOTA: Si el valor del puerto se modifica, se deberá modificar también el
 * puerto dentro de la aplicación de Flutter en modo desarrollo.
 */
export const APP_PORT = 3001 as const;

/**
 * El nombre del servidor de correo que se utilizará para enviar correos.
 */
export const EMAIL_HOST_NAME = 'smtp.protonmail.ch' as const;

/**
 * El puerto del servidor de correo que se utilizará para enviar correos.
 */
export const EMAIL_HOST_PORT = 587 as const;

/**
 * El usuario que se utilizará para autenticarse y enviar correos mediante el
 * servidor de correo.
 */
export const EMAIL_USER_NAME = getEnvironmentVariable('EMAIL_USER_NAME');

/**
 * La contraseña que se utilizará para autenticarse y enviar correos mediante
 * el servidor de correo.
 */
export const EMAIL_USER_TOKEN = getEnvironmentVariable('EMAIL_USER_TOKEN');

/**
 * El nombre de la entidad donde se permite utilizar el JSON Web Token.
 */
export const JWT_AUDIENCE = getEnvironmentVariable('JWT_AUDIENCE');

/**
 * El nombre de la entidad que firmó el JSON Web Token.
 */
export const JWT_ISSUER = getEnvironmentVariable('JWT_ISSUER');

/**
 * El secreto que se utilizará para validar y firmar JSON Web Tokens.
 */
export const JWT_SECRET = getEnvironmentVariable('JWT_SECRET');

/**
 * La URL del servidor de MongoDB donde se guardarán todos los datos de la
 * aplicación.
 */
export const MONGO_DB_CONNECTION_URL = getEnvironmentVariable('MONGO_DB_CONNECTION_URL');

/**
 * El nombre de la base de datos de MongoDB donde se guardarán todos los datos
 * de la aplicación.
 */
export const MONGO_DB_DATABASE_NAME = getEnvironmentVariable('MONGO_DB_DATABASE_NAME');

import { getEnvironmentVariable } from '#utils/Process/getEnvironmentVariable.js';

/**
 * El dominio permitido para los correos electrónicos.
 *
 * Cualquier correo electrónico que no utilice este dominio será rechazado al
 * momento de intentar crear una cuenta nueva.
 */
export const ALLOWED_EMAIL_DOMAIN = getEnvironmentVariable('ALLOWED_EMAIL_DOMAIN');

/**
 * El puerto en el que se ejecutará la aplicación de Nest.
 *
 * NOTA: Si el valor del puerto se modifica, se deberá modificar también el
 * puerto dentro de la aplicación de Flutter en modo desarrollo.
 */
export const PORT = 3001;

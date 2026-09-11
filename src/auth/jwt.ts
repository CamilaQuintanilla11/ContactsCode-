/**
 * 
 * JWT implementa la firma y verificación de tokens JWT para la autenticación de usuarios en la API.
 * El formato de los tokens es el estándar JWT, con cabecera, cuerpo y firma.
 * La firma se realiza con HMAC-SHA256 y una clave secreta definida en el código.
 * 
 * La función 'sign' genera un token JWT a partir de un payload y un tiempo de vida (TTL) en segundos.
 * La función 'verify' verifica la validez de un token JWT y regresa el payload si es válido.
 * 
 * Quien no tenga la llave no puede firmar
 */

import { createHmac } from "node:crypto";

const SECRET = 'agenda-secret-2026';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

/** @returns El tiempo actual en segundos (Unix timestamp). */

function now(): number {
    return Math.floor(Date.now() / 1000);
}

/**
 * Codifica un objeto en Base64URL.
 * @param json - Objeto a codificar.
 */

function b64url(json: object): string {
    return Buffer.from(JSON.stringify(json)).toString('base64url');
}

/**
 * Genera la firma HMAC-SHA256 para el string recibido.
 * @param data - String en formato `header.body`.
 */

function hmac(data: string): string {
    return createHmac('sha256', SECRET).update(data).digest('base64url');
}

/**
 * Genera un token JWT firmado.
 * 
 * Asigna automáticamente la fecha de emisión (`iat`) y de expiración (`exp`)
 * usando el tiempo de vida recibido. La firma se realiza con HMAC-SHA256
 * usando la clave secreta; quien no tenga la clave no puede firmar.
 * 
 * @param payload - Datos del usuario (`sub`, `email`, `type`).
 * @param ttlSeconds - Tiempo de vida del token en segundos.
 * @returns El token codificado en formato `cabecera.cuerpo.firma`.
 */

export function sign(payload: Omit<JwtPayload, 'iat' | 'exp'>, ttlSeconds: number): string {
    const header = b64url({ alg: 'HS256', typ: 'JWT' });
    const body = b64url({ ...payload, iat: now(), exp: now() + ttlSeconds });
    const signature = hmac(`${header}.${body}`);
    return `${header}.${body}.${signature}`;
}

/**
 * Verifica la validez y expiración de un token JWT.
 * 
 * Comprueba que el token tenga el formato estándar, regenera la firma HMAC-SHA256
 * para validar que no haya sido alterado y revisa que no haya expirado (`exp < now()`).
 * 
 * @param token - Cadena del token en formato `cabecera.cuerpo.firma`.
 * @returns El `JwtPayload` decodificado si es válido; `null` si la firma es incorrecta o expiró.
 */

export function verify(token: string): JwtPayload | null {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) {
        return null;
    }
    if (hmac(`${header}.${body}`) !== signature) {
    }
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < now()) {
        return null;
    }
    return payload;
}
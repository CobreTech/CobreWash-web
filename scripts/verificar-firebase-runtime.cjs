/* eslint-disable @typescript-eslint/no-require-imports -- La regresión verifica las entradas CommonJS de Firebase Admin. */
// Ejecutar con --no-experimental-require-module, como el runtime que fallaba.
const assert = require('node:assert/strict');
const { generateKeyPairSync, sign, verify } = require('node:crypto');
const { createRequire } = require('node:module');

require('firebase-admin/auth');
require('firebase-admin/storage');
require('firebase-admin/data-connect');
const firebaseRequire = createRequire(require.resolve('firebase-admin/auth'));
const jwks = firebaseRequire('jwks-rsa');

async function main() {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'runtime-regression', alg: 'RS256', use: 'sig' };
  const client = jwks({
    jwksUri: 'https://unused.invalid/jwks',
    cache: false,
  });
  client.getKeys = async () => [jwk];
  const resolved = await client.getSigningKey(jwk.kid);
  const bytes = Buffer.from('CobreWash Firebase runtime regression');
  const signature = sign('RSA-SHA256', bytes, privateKey);
  assert.equal(resolved.kid, jwk.kid);
  assert.ok(verify('RSA-SHA256', bytes, resolved.getPublicKey(), signature));
  assert.equal(verify('RSA-SHA256', Buffer.from('alterado'), resolved.getPublicKey(), signature), false);
  await assert.rejects(() => client.getSigningKey('clave-inexistente'), { name: 'SigningKeyNotFoundError' });
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: jwk.kid })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: 'runtime-regression' })).toString('base64url');
  const input = `${header}.${payload}`;
  const token = `${input}.${sign('RSA-SHA256', Buffer.from(input), privateKey).toString('base64url')}`;
  const passport = jwks.passportJwtSecret({ jwksUri: 'https://unused.invalid/jwks', getKeysInterceptor: () => [jwk] });
  const passportKey = await new Promise((resolve, reject) => {
    passport({}, token, (error, key) => error ? reject(error) : resolve(key));
  });
  assert.equal(passportKey, resolved.getPublicKey());
  const invalidKey = await new Promise((resolve, reject) => {
    passport({}, 'token-invalido', (error, key) => error ? reject(error) : resolve(key));
  });
  assert.equal(invalidKey, null);
  console.log('Firebase Admin carga y valida claves RSA sin require(ESM); rechaza firmas alteradas y claves desconocidas.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });

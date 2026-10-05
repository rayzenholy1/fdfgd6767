import * as Crypto from 'expo-crypto';

const SECRET = 'change-me-secret';
const ACCESS_TTL = 15 * 60;
const REFRESH_TTL = 7 * 24 * 60 * 60;

const b64url = (str) =>
  btoa(unescape(encodeURIComponent(str)))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const sign = async (data) => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${data}.${SECRET}`,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return hash.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const randomHex = async (bytes) => {
  const arr = await Crypto.getRandomBytesAsync(bytes);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};

export const createAccessToken = async ({ email, firstName, lastName }) => {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({
      sub: email,
      email,
      firstName,
      lastName,
      iat: now,
      exp: now + ACCESS_TTL,
      jti: await randomHex(8),
    })
  );
  const signature = await sign(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
};

export const createRefreshToken = async () => randomHex(32);

export const createTokens = async (user) => {
  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(user),
    createRefreshToken(),
  ]);
  const now = Date.now();
  return {
    user,
    accessToken,
    refreshToken,
    accessExpiresAt: now + ACCESS_TTL * 1000,
    refreshExpiresAt: now + REFRESH_TTL * 1000,
  };
};

export const decodePayload = (token) => {
  const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(atob(part))));
};

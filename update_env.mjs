import crypto from 'crypto';
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import fs from 'fs';

async function run() {
  const keys = await generateKeyPair("RS256", { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  const formattedPrivateKey = privateKey.trimEnd().replace(/\n/g, " ");

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  let newEnv = envLocal;

  // Append or replace
  if (newEnv.includes('JWT_PRIVATE_KEY')) {
    newEnv = newEnv.replace(/JWT_PRIVATE_KEY=.*/, `JWT_PRIVATE_KEY="${formattedPrivateKey}"`);
  } else {
    newEnv += `\nJWT_PRIVATE_KEY="${formattedPrivateKey}"`;
  }

  if (newEnv.includes('JWKS')) {
    newEnv = newEnv.replace(/JWKS=.*/, `JWKS='${jwks}'`);
  } else {
    newEnv += `\nJWKS='${jwks}'`;
  }

  fs.writeFileSync('.env.local', newEnv);
  console.log("Successfully updated .env.local with space-formatted PEM key.");
}

run().catch(console.error);

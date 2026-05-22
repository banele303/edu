import { spawnSync } from 'child_process';
import fs from 'fs';

const privateKey = fs.readFileSync('private_key.pem', 'utf8');
const b64Key = Buffer.from(privateKey).toString('base64');

console.log("Setting JWT_PRIVATE_KEY_B64...");
const res = spawnSync('bun', ['x', 'convex', 'env', 'set', 'JWT_PRIVATE_KEY_B64', b64Key], { shell: true, stdio: 'inherit' });

if (res.status === 0) {
  console.log("Success!");
} else {
  console.error("Failed");
}

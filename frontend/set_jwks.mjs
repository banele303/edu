import { spawnSync } from 'child_process';

const jwks = `{"keys":[{"use":"sig","alg":"RS256","kty":"RSA","n":"x0S1FhGqpRiRXDX3khWdU2Z8mDwLZPBUbL4ftQXhhXV5S0rxUTSqWPVcR9vaKghj3f6qsTl_UCk-0qEI2SNQ2BHNMG6KbsiL5CTs97-Q3PedthTEFq9zX12QmEFySFZfM7kSNw-_Ff0xdKRbMXQH2cm40d4b58VIBPnLXbUNIKGrUcYR24RmeEbgd4rRDoCwg0JXMUKWV_pQtPMmvPlOcj53hplwEPHwxIcaCrFTJZfMdkRklfmNNKN2QU00KPlYBaV6v15CF-jCWMWD1ClJswLid2HP6TrML6F5n2NL3-tgi9EHKCwAFiSM-8sVViYzAczaFzj8EFpQh20BARQA_Q","e":"AQAB"}]}`;

console.log("Setting JWKS...");
const res = spawnSync('bun', ['x', 'convex', 'env', 'set', 'JWKS', jwks], { shell: true, stdio: 'inherit' });

if (res.status === 0) {
  console.log("Success!");
} else {
  console.error("Failed");
}

// Clerk 6.39.7 spreads React children into a server-action payload in keyless
// development mode. Keep rendering children, but send only the action's inputs.
// Clerk 7 removed these files, so newer releases intentionally skip this patch.
const fs = require('node:fs');
const path = require('node:path');

const clerkRoot = path.resolve(path.dirname(require.resolve('@clerk/nextjs')), '../..');
const inputs = [
  'claimUrl: props.claimUrl,',
  'publishableKey: props.publishableKey,',
  'secretKey: props.secretKey,',
].join('\n          ');

for (const build of ['esm', 'cjs']) {
  const file = path.join(clerkRoot, 'dist', build, 'app-router/client/keyless-cookie-sync.js');
  if (!fs.existsSync(file)) continue;

  const source = fs.readFileSync(file, 'utf8');
  const patched = source.replace(
    /(syncKeylessConfigAction\(\{\s*)\.\.\.props,/,
    (_, prefix) => prefix + inputs,
  );
  if (patched !== source) {
    fs.writeFileSync(file, patched);
    console.log(`Patched Clerk keyless server-action payload (${build}).`);
  } else if (!source.includes(inputs)) {
    throw new Error(`Clerk keyless implementation changed (${build}); review or remove the patch.`);
  }
}

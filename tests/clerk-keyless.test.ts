// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const clerkRoot = path.resolve(path.dirname(require.resolve('@clerk/nextjs')), '../..');

describe('Clerk keyless server-action boundary', () => {
  for (const build of ['esm', 'cjs']) {
    it(`sends only serializable action inputs and preserves children (${build})`, () => {
      const source = readFileSync(
        path.join(clerkRoot, 'dist', build, 'app-router/client/keyless-cookie-sync.js'),
        'utf8',
      );
      const payload = source.match(/syncKeylessConfigAction\((\{[\s\S]*?\})\)/)?.[1];
      expect(payload).toBeDefined();
      const result = runInNewContext(`(${payload})`, {
        props: {
          claimUrl: 'https://example.com/claim',
          publishableKey: 'pk_test_example',
          secretKey: 'sk_test_example',
          apiKeysUrl: 'https://example.com/keys',
          children: { type: () => null },
        },
        window: { location: { href: 'http://localhost:3000/' } },
      });
      expect(result).toEqual({
        claimUrl: 'https://example.com/claim',
        publishableKey: 'pk_test_example',
        secretKey: 'sk_test_example',
        returnUrl: 'http://localhost:3000/',
      });
      expect(source).toContain('return props.children;');
    });
  }
});

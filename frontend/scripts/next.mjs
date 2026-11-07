// Runs the Next.js CLI with a clean environment.
//
// Some editor extensions (e.g. CodeGPT in VS Code) leak their own Next.js server
// variables into every terminal. `__NEXT_PRIVATE_STANDALONE_CONFIG` makes Next
// ignore next.config.mjs and use a foreign JSON config, which breaks `next build`
// with "TypeError: generate is not a function". A leaked NODE_ENV=production also
// confuses `next dev`. Next sets NODE_ENV itself, so it is safe to drop.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const env = { ...process.env };
for (const key of Object.keys(env)) {
  if (key.startsWith('__NEXT_PRIVATE_')) delete env[key];
}
delete env.NODE_ENV;

const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], { stdio: 'inherit', env });
child.on('exit', (code, signal) => (signal ? process.kill(process.pid, signal) : process.exit(code ?? 0)));

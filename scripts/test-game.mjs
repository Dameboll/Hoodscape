import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
fs.mkdirSync('work',{recursive:true});
await build({entryPoints:['tests/game.test.ts'],outfile:'work/game-tests.mjs',bundle:true,platform:'node',format:'esm',packages:'external'});
const result=spawnSync(process.execPath,['--test',...process.argv.slice(2),'work/game-tests.mjs'],{stdio:'inherit'});process.exitCode=result.status||0;

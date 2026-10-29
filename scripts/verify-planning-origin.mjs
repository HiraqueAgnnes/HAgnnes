// Run the existing isolated tests on a separate complete source checkout.
// This helper never installs dependencies, builds, publishes, or contacts production.
import {readFileSync,writeFileSync,unlinkSync,existsSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const origin=path.resolve(process.argv[2]||'');
if(!process.argv[2]||!existsSync(path.join(origin,'lib/statistics-territory.ts')))throw Error('Informe uma cópia completa e isolada do Planejamento.');
for(const name of ['check-statistics-access.mjs','check-statistics-map.mjs']) {
  const input=path.join(origin,'scripts',name);
  const output=path.join(origin,'scripts','.review-'+name);
  let source=readFileSync(input,'utf8');
  source="import {pathToFileURL} from 'node:url';\n"+source;
  source=source.replace(/import\(((?:directory|dir)\s*\+\s*'[^']*')\)/g,'import(pathToFileURL($1).href)');
  source=source.replace('Object.entries({',"Object.entries({'statistics-territory':'lib/statistics-territory.ts',units:'lib/units.ts',");
  writeFileSync(output,source,{flag:'wx'});
  let result;
  try {result=spawnSync(process.execPath,[output],{cwd:origin,stdio:'inherit'});}
  finally {unlinkSync(output);}
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}

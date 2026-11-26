// Resolve only on an isolated branch/runner. No force, peer bypass or scripts.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
const lane=process.argv[2]
if(!['compatible','next15','next15-clerk7'].includes(lane)) throw Error('Unknown lane')
const manifest=JSON.parse(readFileSync('package.json','utf8'))
function npm(args){return execFileSync('npm',args,{encoding:'utf8',stdio:['ignore','pipe','inherit'],maxBuffer:32*1024*1024}).trim()}
function latestStable(name,range){
  const raw=JSON.parse(npm(['view',name+'@'+range,'version','--json']))
  const versions=(Array.isArray(raw)?raw:[raw]).filter(v=>typeof v==='string' && /^\d+\.\d+\.\d+$/.test(v))
  versions.sort((a,b)=>{const x=a.split('.').map(Number),y=b.split('.').map(Number);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]})
  if(!versions.length) throw Error('No published stable candidate for '+name+' '+range)
  return versions.at(-1)
}
// Floors come from the exact production audit, not unconstrained npm latest.
for(const [name,range] of Object.entries({axios:'>=1.20.0 <2',zod:'>=4.6.6 <5',svix:'>=1.91.2 <2'})){
  manifest.dependencies[name]=latestStable(name,range)
}
manifest.devDependencies.postcss=latestStable('postcss','>=8.5.23 <9')
if(lane!=='compatible'){
  manifest.dependencies.next=latestStable('next','>=15.5.29 <16')
  manifest.devDependencies['eslint-config-next']=manifest.dependencies.next
  if(lane==='next15-clerk7') manifest.dependencies['@clerk/nextjs']=latestStable('@clerk/nextjs','>=7.10.10 <8')
}
// Keep other direct ranges unchanged. Compatible resolver repairs only
// reachable versions within declared constraints; review the lock diff.
writeFileSync('package.json',JSON.stringify(manifest,null,2)+'\n')
console.log('Candidate direct versions',JSON.stringify({next:manifest.dependencies.next,clerk:manifest.dependencies['@clerk/nextjs'],axios:manifest.dependencies.axios,zod:manifest.dependencies.zod,svix:manifest.dependencies.svix,postcss:manifest.devDependencies.postcss}))
console.log(npm(['install','--package-lock-only','--ignore-scripts','--no-audit','--no-fund']))
// Non-forced audit repair may adjust compatible transitive resolutions.
// A nonzero audit exit is expected until all findings are repaired.
try {console.log(npm(['audit','fix','--package-lock-only','--ignore-scripts','--no-fund']))} catch(error){console.log('Non-forced audit repair exit',error.status);if(error.status!==1) throw error}
const resolved=JSON.parse(readFileSync('package-lock.json','utf8'))
for(const name of ['next','@clerk/nextjs','axios','zod','svix']){
  const version=resolved.packages['node_modules/'+name]?.version
  if(!version) throw Error('Missing resolved dependency '+name)
  console.log(name,version)
}

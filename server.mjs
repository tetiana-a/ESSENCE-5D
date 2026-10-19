import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {AppError,providers,validateInput,queryProvider} from './lib/analysis.mjs';
import {roles} from './public/roles.js';
const root=new URL('./public/',import.meta.url);
export function createApp({fetcher=fetch,env=process.env}={}){
 const sessions=new Map();
 const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const send=(status,b)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(b));};
  try{
   const host=req.headers.host;if(!/^127\.0\.0\.1:\d+$/.test(host||'')&&!/^localhost:\d+$/.test(host||''))throw new AppError('origin',403);
   const url=new URL(req.url,`http://${host}`);
   if(url.pathname.startsWith('/api/')){
    if(req.method!=='GET'&&req.headers.origin!==`http://${host}`)throw new AppError('origin',403);
    const now=Date.now();for(const [id,s] of sessions)if(now-s.created>3600000)sessions.delete(id);
    let sid=req.headers.cookie?.split('; ').find(x=>x.startsWith('essence='))?.slice(8),session=sessions.get(sid);
    if(!session){if(sessions.size>=500)throw new AppError('limit',429);sid=randomBytes(32).toString('hex');session={created:now,keys:{},requests:[],busy:false};sessions.set(sid,session);res.setHeader('Set-Cookie',`essence=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`);}
    if(req.method==='GET'&&url.pathname==='/api/status')return send(200,{connected:Object.fromEntries(Object.entries(providers).map(([p,c])=>[p,Boolean(session.keys[p]||env[c.env])]))});
    if(req.method!=='POST')throw new AppError('notFound',404);
    if(!req.headers['content-type']?.startsWith('application/json'))throw new AppError('input');
    const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>80000)throw new AppError('input',413);chunks.push(chunk);}const body=Buffer.concat(chunks).toString('utf8');
    let b;try{b=JSON.parse(body);}catch{throw new AppError('input');}if(!b||typeof b!=='object'||Array.isArray(b))throw new AppError('input');
    if(url.pathname==='/api/key'){
     if(!Object.hasOwn(providers,b.provider)||typeof b.key!=='string'||b.key.length>512||/[\r\n]/.test(b.key))throw new AppError('input');
     if(b.key.trim())session.keys[b.provider]=b.key.trim();else delete session.keys[b.provider];
     return send(200,{connected:Boolean(session.keys[b.provider]||env[providers[b.provider].env])});
    }
    if(url.pathname==='/api/analyze'){
     b=validateInput(b);const key=session.keys[b.provider]||env[providers[b.provider].env];if(!key)throw new AppError('missingKey',401);
     session.requests=session.requests.filter(t=>now-t<60000);if(session.busy||session.requests.length>=6)throw new AppError('limit',429);
     session.requests.push(now);session.busy=true;try{const result=await queryProvider(b,key,roles.en,fetcher);return send(200,{...result,provider:b.provider,createdAt:new Date().toISOString(),source:'ai'});}finally{session.busy=false;}
    }
    throw new AppError('notFound',404);
   }
   const paths={'/':'index.html','/app.js':'app.js','/styles.css':'styles.css','/i18n.js':'i18n.js','/roles.js':'roles.js','/records.js':'records.js'};
   if(req.method!=='GET'||!paths[url.pathname])throw new AppError('notFound',404);
   const file=paths[url.pathname],type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html';
   const content=await readFile(new URL(file,root));res.writeHead(200,{'Content-Type':`${type}; charset=utf-8`});res.end(content);
  }catch(e){send(e instanceof AppError?e.status:500,{error:e instanceof AppError?e.code:'server'});}
 });
 const cleanup=setInterval(()=>{for(const [id,s]of sessions)if(Date.now()-s.created>=3600000)sessions.delete(id);},1000).unref();
 server.on('close',()=>{clearInterval(cleanup);sessions.clear();});return server;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])createApp().listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`ESSENCE 5D • http://127.0.0.1:${Number(process.env.PORT)||4173}`));

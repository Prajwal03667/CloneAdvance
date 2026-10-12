const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const nodes=new Map();
function node(){return {style:{},hidden:false,textContent:'',value:'TOOLUP',children:[],after(){},append(...n){this.children.push(...n)},contains(){return false},addEventListener(){},querySelector(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)}};}
let install;
const context=vm.createContext({globalThis:{},PlayGTA5Controller:{attach:()=>({release(){}})},document:{createElement:node,body:node(),exitPointerLock(){}},addEventListener(){},fetch:async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('web/cheats.json'))}),setTimeout:fn=>fn(),Atomics});
vm.runInContext(fs.readFileSync('web/extras.js','utf8'),context);
const buffer=new SharedArrayBuffer(512),keys=new Uint8Array(buffer,0,256),w=new Int32Array(buffer,256,10),U16=new Uint16Array(buffer,296,64);
context.globalThis.PlayGTA5Extras.install({keys,w,U16,VK:{Backquote:192},canvas:{}});
nodes.get('#send-cheat').onclick(); assert.equal(w[8],7); assert.equal(String.fromCharCode(...U16.slice(0,7)),'TOOLUP\r');
w[8]=63; w[9]=0; nodes.get('#send-cheat').onclick(); assert.equal(w[8],63); assert.match(nodes.get('#cheat-status').textContent,/busy/);
w[8]=63;w[9]=63;nodes.get('#send-cheat').onclick();assert.equal(w[8],70);assert.equal(U16[63],84);assert.equal(U16[5],13);
console.log('PASS: cheat input, full-ring rejection, wraparound, and no automatic activation claim');

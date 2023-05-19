const $=$substore;
const sim=$arguments["sim"]
const flag=$arguments["flag"]
const numone=$arguments["one"]
const batch_size=$arguments["batch"]?$arguments["batch"]:100;
const keynames=$arguments.name?decodeURI($arguments.name):"";
const timeout=$arguments["timeout"]?$arguments["timeout"]:1e3;
return proxies}const startTime=new Date;
const prs=proxies.length;console.log(`初始节点: `+prs+"个");
console.log("处理节点: 0%");
let i=0;
let completed=0;
let counter=0;
while(i<proxies.length){const batch=proxies.slice(i,i+batch_size);
await Promise.allSettled(batch.map(async proxy=>{try{completed++;
counter++;
if(counter%4===0){const progress=completed/proxies.length*98;
console.log(`处理进度: ${progress.toFixed(0)}%`)}const in_info=await queryDNSInfo(proxy.server,dnsCache);
const out_info=await queryIpApi(proxy);
const operator=in_info.data[in_info.data.length-1];const dly=kkEmoji[operator]||"🅶";
if(in_info.ip===out_info.query){proxy.name="🆉直连"+"→"+getFlagEmoji(out_info.countryCode)+out_info.country}else{proxy.name=dly+incity+"→"+getFlagEmoji(out_info.countryCode)+out_info.country}}else if(sim){if(in_info.ip===out_info.query){proxy.name="直连"+"→"+out_info.country}else{proxy.name=incity.slice(0,1)+in_info.data[in_info.data.length-1].slice(0,1)+"→"+out_info.country}}else{if(in_info.ip===out_info.query){proxy.name="直连"+"→"+out_info.country}else{proxy.name=incity+in_info.data[in_info.data.length-1]+"→"+out_info.country}}proxy.qc=in_info.ip+"|"+out_info.query}catch(err){}}));i+=batch_size}proxies=removeDuplicateName(proxies);
proxies=removeqcName(proxies);
proxies=processProxies(proxies);
if(keynames!==""){proxies.forEach(proxy=>{proxy.name=keynames+" "+proxy.name})}numone&&(proxies=oneProxies(proxies));
const prso=proxies.length;console.log("处理进度: 100%");
console.log(`去复用后: `+prso+"个");
const endTime=new Date;
const timeDiff=endTime.getTime()-startTime.getTime();
console.log(`方法用时: ${timeDiff/1e3} 秒`);
const tzs=prso==prs?"无复用节点，":"去除无效节点后剩"+prso+"个，";
$notification.post(prs+"个节点处理已完成","",tzs+"用时"+timeDiff/1e3+"秒");
return proxies}const dnsCache={};
async function queryDNSInfo(server){if(dnsCache[server]){return dnsCache[server]}return new Promise((resolve,reject)=>{const ips=server;
const url=`http://www.inte.net/tool/ip/api.ashx?ip=${server}&datatype=json`;$.http.get({url:url}).then(resp=>{const dnsInfo=JSON.parse(resp.body);
dnsCache[server]=dnsInfo;if(dnsInfo.ip!=="0.0.0.0"){resolve(dnsInfo)}else{resolve(ips)}})["catch"](err=>{reject(err)})})}const proxyCache={};
async function queryIpApi(proxy){const cacheKey=`${proxy.server}:${proxy.port}`;
if(proxyCache[cacheKey]){return proxyCache[cacheKey]}return new Promise((resolve,reject)=>{const url=`http://ip-api.com/json?lang=zh-CN&fields=status,message,country,countryCode,city,query`;let node=ProxyUtils.produce([proxy],target);
const timeoutPromise=new Promise((_,reject)=>{setTimeout(()=>{reject()},timeout)})
const queryPromise=$.http.get({url:url,node:node,"policy-descriptor":node}).then(resp=>{const data=JSON.parse(resp.body);
if(data.status==="success"){proxyCache[cacheKey]=data;
resolve(data)}else{reject()}})["catch"](err=>{reject(err)});
Promise.race([timeoutPromise,queryPromise])["catch"](err=>{reject(err)})})}function removeDuplicateName(arr){const nameSet=new Set;const result=[];
for(const e of arr){if(e.qc&&!nameSet.has(e.qc)){nameSet.add(e.qc);result.push(e)}}return result}function removeqcName(arr){const nameSet=new Set;
const result=[];
for(const e of arr){if(!nameSet.has(e.qc)){nameSet.add(e.qc);
const modifiedE={...e};delete modifiedE.qc;
result.push(modifiedE)}}return result}function processProxies(proxies){const groupedProxies=proxies.reduce((groups,item)=>{const existingGroup=groups.find(group=>group.name===item.name);if(existingGroup){existingGroup.count++;existingGroup.items.push({...item,name:`${item.name} ${existingGroup.count.toString().padStart(2,"0")}`})}else{groups.push({name:item.name,count:1,items:[{...item,name:`${item.name} 01`}]})}return groups},[]);const sortedProxies=groupedProxies.flatMap(group=>group.items);proxies.splice(0,proxies.length,...sortedProxies);return proxies}function getFlagEmoji(cc){const codePoints=cc.toUpperCase().split("").map(char=>127397+char.charCodeAt());return String.fromCodePoint(...codePoints).replace(/🇹🇼/g,"🇨🇳")}function oneProxies(proxies){const groups=proxies.reduce((groups,proxy)=>{const name=proxy.name.replace(/\s\d+$/,"");if(!groups[name]){groups[name]=[]}groups[name].push(proxy);return groups},{});
for(const name in groups){if(groups[name].length===1&&groups[name][0].name.endsWith(" 01")){const proxy=groups[name][0];proxy.name=name}}return proxies}

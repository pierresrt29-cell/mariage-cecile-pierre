const json=(statusCode,data)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:JSON.stringify(data)});
exports.relay=async(event,action)=>{
 if(event.httpMethod!=='POST')return json(405,{error:'Méthode refusée'});
 if(!process.env.APPS_SCRIPT_URL||!process.env.APPS_SCRIPT_SECRET)return json(503,{error:'Connexion Google Sheets non configurée'});
 if((event.body||'').length>6000)return json(413,{error:'Requête trop volumineuse'});
 let d;try{d=JSON.parse(event.body||'{}')}catch{return json(400,{error:'Requête invalide'})}
 const code=String(d.code||'').trim().toUpperCase();
 if(!/^SARDINE\d{1,5}$/.test(code))return json(400,{error:'Code invalide'});
 const payload={action,code,secret:process.env.APPS_SCRIPT_SECRET};
 if(action==='submit'){
  if(!['Oui','Non'].includes(d.presence))return json(400,{error:'Présence invalide'});
  const adultes=Number(d.adultes),bebes=Number(d.bebes);
  if(!Number.isInteger(adultes)||!Number.isInteger(bebes)||adultes<0||bebes<0||adultes>20||bebes>20)return json(400,{error:'Nombre invalide'});
  Object.assign(payload,{presence:d.presence,adultes,bebes,allergies:String(d.allergies||'').slice(0,1000),message:String(d.message||'').slice(0,2000)});
 }
 try {
  const r=await fetch(process.env.APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow',signal:AbortSignal.timeout(15000)});
  const t=await r.text();let data;try{data=JSON.parse(t)}catch{throw Error('Réponse inattendue')}
  if(!r.ok)return json(502,{error:'Service temporairement indisponible'});
  if(data.success===false)return json(action==='lookup'?404:400,{error:data.error||'Opération impossible',success:false});
  return json(200,action==='lookup'?data.invitation:{success:true});
 }catch(err){console.error('Relay failed',err.message);return json(502,{error:'Connexion temporairement indisponible'});}
};

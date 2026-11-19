// Relais serveur : aucune adresse de script Google n'est exposée dans la page.
exports.handler = async (event) => {
 if (event.httpMethod !== 'POST') return {statusCode:405,body:JSON.stringify({success:false,error:'Méthode refusée'})};
 const url=process.env.APPS_SCRIPT_URL;
 if (!url) return {statusCode:503,headers:{'Content-Type':'application/json'},body:JSON.stringify({success:false,error:'Connexion Google Sheets à configurer'})};
 let data;
 try{data=JSON.parse(event.body||'{}')}catch{return {statusCode:400,body:JSON.stringify({success:false,error:'Données invalides'})}}
 const code=String(data.code||'').trim().toUpperCase();
 if(!/^SARDINE\d{1,5}$/.test(code)||!['Oui','Non'].includes(data.presence))return {statusCode:400,body:JSON.stringify({success:false,error:'Réponse invalide'})};
 const adultes=Number(data.adultes),bebes=Number(data.bebes);
 if(!Number.isInteger(adultes)||!Number.isInteger(bebes)||adultes<0||adultes>20||bebes<0||bebes>20)return {statusCode:400,body:JSON.stringify({success:false,error:'Nombre invalide'})};
 const payload={code,presence:data.presence,adultes,bebes,allergies:String(data.allergies||'').slice(0,1000),message:String(data.message||'').slice(0,2000)};
 try{
 const response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow',signal:AbortSignal.timeout(12000)});
 const body=await response.text();let result;try{result=JSON.parse(body)}catch{throw Error('Réponse Google inattendue : vérifiez les droits du déploiement')}
 if(!response.ok||result.success!==true)throw Error('Google Sheets n’a pas confirmé l’enregistrement');
 return {statusCode:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({success:true})};
 }catch(e){return {statusCode:502,headers:{'Content-Type':'application/json'},body:JSON.stringify({success:false,error:'Impossible d’enregistrer la réponse pour le moment'})}}
};

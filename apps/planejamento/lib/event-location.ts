export const ALL_CITIES='Todas';
export const ALL_NEIGHBORHOODS='Todos';
export const OFFICIAL_EVENT_LOCATION='Conforme Ofício do Responsável do Evento';
export function allCitiesEvent<T extends Record<string,any>>(event:T){return event.city===ALL_CITIES?{...event,neighborhood:ALL_NEIGHBORHOODS,locationName:OFFICIAL_EVENT_LOCATION,latitude:null,longitude:null}:event;}
export function changeEventCity(event:Record<string,any>,city:string){
 if(city===ALL_CITIES)return {city,neighborhood:ALL_NEIGHBORHOODS,locationName:OFFICIAL_EVENT_LOCATION,latitude:null,longitude:null};
 return event.city===ALL_CITIES?{city,neighborhood:'',locationName:'',latitude:null,longitude:null}:{city};
}
export function locationCoordinates(latitude:unknown,longitude:unknown){
 const a=String(latitude??'').trim(),b=String(longitude??'').trim();if(!a&&!b)return null;
 const decimal=/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
 if(!decimal.test(a)||!decimal.test(b))throw new Error('Informe latitude e longitude numéricas.');
 const lat=Number(a.replace(',','.')),lng=Number(b.replace(',','.'));
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat < -90||lat > 90||lng < -180||lng > 180)throw new Error('Latitude deve estar entre -90 e 90; longitude, entre -180 e 180.');
 return {latitude:lat,longitude:lng};
}
export function mapsSearch(query:string){return 'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query}).toString();}
export function coordinatesFromMaps(input:string){
 const text=input.trim();if(text.length>4096)throw new Error('O link excede o limite de tamanho.');
 function pair(value:string){const match=value.match(/^\s*([+-]?\d+(?:\.\d+)?)\s*[, ]\s*([+-]?\d+(?:\.\d+)?)\s*$/)||value.match(/^\s*([+-]?\d+(?:,\d+)?)\s*;\s*([+-]?\d+(?:,\d+)?)\s*$/);return match?locationCoordinates(match[1],match[2]):null;}
 const direct=pair(text);if(direct)return direct;
 let url:URL;try{url=new URL(text);}catch{throw new Error('Cole as coordenadas do ponto ou um link completo do Google Maps.');}
 if(url.protocol!=='https:'||!['www.google.com','google.com','maps.google.com','www.google.com.br','google.com.br','maps.google.com.br','maps.app.goo.gl','goo.gl'].includes(url.hostname))throw new Error('Use um link HTTPS do Google Maps.');
 const data=decodeURIComponent(url.pathname+url.search);const point=data.match(/!3d([+-]?\d+(?:\.\d+)?)!4d([+-]?\d+(?:\.\d+)?)/);if(point)return locationCoordinates(point[1],point[2])!;
 for(const key of ['query','q','destination']){const value=url.searchParams.get(key);if(value){const p=pair(value);if(p)return p;}}
 throw new Error('Este link não contém as coordenadas exatas do ponto. No Google Maps, clique com o botão direito no local e copie a latitude e longitude exibidas.');
}

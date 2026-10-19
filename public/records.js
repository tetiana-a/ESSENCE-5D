import {translations} from './i18n.js';
import {roles} from './roles.js';
const dims=['data','context','connections','blindSpots','action'];
export function validRecord(r){
 const a=r?.analysis;
 return Boolean(r&&typeof r.id==='string'&&typeof r.text==='string'&&typeof r.createdAt==='string'&&!Number.isNaN(Date.parse(r.createdAt))&&typeof r.model==='string'&&typeof r.provider==='string'&&Object.hasOwn(translations,r.language)&&r.source==='ai'&&(r.usage===null||typeof r.usage==='number')&&Array.isArray(r.roles)&&r.roles.every(i=>Number.isInteger(i)&&i>=0&&i<60)&&a&&typeof a.summary==='string'&&dims.every(d=>Array.isArray(a.dimensions?.[d])&&a.dimensions[d].every(s=>typeof s==='string'))&&Array.isArray(a.nodes)&&a.nodes.every(n=>n&&typeof n.id==='string'&&typeof n.label==='string')&&Array.isArray(a.edges)&&a.edges.every(e=>e&&typeof e.label==='string'&&a.nodes.some(n=>n.id===e.source)&&a.nodes.some(n=>n.id===e.target)));
}
export function formatExport(r,type){
 if(type==='json')return JSON.stringify(r,null,2);
 const labels=translations[r.language]||translations.en;
 const node=id=>r.analysis.nodes.find(n=>n.id===id)?.label||id;
 return `# ESSENCE 5D\n\n${labels.source}: ${r.provider} / ${r.model}\n${r.createdAt}\n\n## ${labels.question}\n\n${r.text}\n\n## ${labels.result}\n\n${r.analysis.summary}\n\n${dims.map(d=>`## ${labels[d]}\n\n${r.analysis.dimensions[d].map(s=>'- '+s).join('\n')}`).join('\n\n')}\n\n## ${labels.council}\n\n${r.roles.map(i=>roles[r.language]?.[i]||roles.en[i]).join(', ')}\n\n## ${labels.edges}\n\n${r.analysis.edges.map(e=>`- ${node(e.source)} → ${node(e.target)}: ${e.label}`).join('\n')}\n\n${labels.hypotheses}\n`;
}

import { starteBrowser } from "./lib/chrome.mjs";
const BASE = "http://localhost:4331";
const pages = ["/","/karriere","/leistungen/veneers","/leistungen/keramikinlays","/veneers-berlin","/praxis","/praxis/kerrin-gratecap","/magazin","/magazin/warum-wir-nicht-mehr-abformen","/impressum","/404"];
const browser = await starteBrowser();
const res = {};
for (const vp of [{w:1440,h:900},{w:390,h:844}]) for (const p of pages) {
  const page = await browser.newPage(); await page.setViewport({width:vp.w,height:vp.h});
  await page.goto(BASE+p+"?nosmooth",{waitUntil:"networkidle2",timeout:120000}).catch(()=>{});
  const found = await page.evaluate(() => { const out=[]; for (const el of document.querySelectorAll("body *")) {
    const t=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(" "); if(!t) continue;
    const cs=getComputedStyle(el); const fs=parseFloat(cs.fontSize); if (fs>=14) continue;
    const home=!!el.closest(".c-footer,.c-nav,.c-megamenu,.c-navpromo,.s-hero,.c-reviews");
    const cls=[...el.classList].filter(c=>/^[sc]-/.test(c))[0] || (el.parentElement?[...el.parentElement.classList].filter(c=>/^[sc]-/.test(c))[0]+" > "+el.tagName.toLowerCase():el.tagName);
    out.push([cls, Math.round(fs*10)/10, cs.fontFamily.includes("Mono")?"mono":"sans", t.slice(0,36), home]); } return out; });
  for (const [cls,fs,fam,t,home] of found) { const k=`${cls} ${fs}px ${fam}${home?" [shared/home]":""}`; (res[k] ??= {pages:new Set(), vps:new Set(), ex:t}).pages.add(p); res[k].vps.add(vp.w); }
  await page.close();
}
await browser.close();
for (const [k,v] of Object.entries(res).sort()) console.log(`${k} | ${[...v.vps].join("/")} | ${[...v.pages].join(",")} | ${v.ex}`);

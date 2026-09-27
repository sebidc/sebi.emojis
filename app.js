(() => {
'use strict';
const stickers=window.STICKERS;
const categories=['All little guys','Feelings & moods','Food & drink','Cozy','Work & study','Play & create','Animals & costumes'];
const grid=document.getElementById('grid'),search=document.getElementById('search'),filters=document.getElementById('filters'),more=document.getElementById('more'),preview=document.getElementById('preview');
let category=categories[0],limit=60,results=stickers;
const titleCase=s=>s.replace(/\b\w/g,c=>c.toUpperCase());
const escaped=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const name of categories){const button=document.createElement('button');button.className='filter';button.textContent=name;button.setAttribute('aria-pressed',String(name===category));button.addEventListener('click',()=>{category=name;limit=60;render()});filters.append(button)}
function render(){const query=search.value.trim().toLowerCase().replace(/-/g,' ');results=stickers.filter(s=>(category===categories[0]||s.category===category)&&`${s.name} ${s.category}`.toLowerCase().includes(query));
for(const button of filters.children)button.setAttribute('aria-pressed',String(button.textContent===category));
document.getElementById('result-count').textContent=`${results.length} ${results.length===1?'little guy':'little guys'}${query?' matching your search':''}`;
grid.innerHTML=results.slice(0,limit).map(s=>`<article class="card"><button class="card-preview" data-file="${s.file}" aria-label="Preview ${escaped(s.name)}"><img src="${s.thumb}" alt="${escaped(s.name)}" loading="lazy" width="240" height="240"></button><div class="card-info"><h3 title="${escaped(s.name)}">${escaped(s.name)}</h3><small>${escaped(s.category)}</small><div class="card-actions"><a href="stickers/${s.file}" download aria-label="Download ${escaped(s.name)} original PNG">PNG ↓</a><a href="stickers-2x/${s.file}" download aria-label="Download ${escaped(s.name)} 2× PNG">2× ↓</a></div></div></article>`).join('');
more.hidden=limit>=results.length;document.getElementById('empty').hidden=results.length!==0;document.getElementById('shown').textContent=results.length?`Showing ${Math.min(limit,results.length)} of ${results.length}`:'';
}
search.addEventListener('input',()=>{limit=60;render()});more.addEventListener('click',()=>{limit+=60;render()});document.getElementById('clear').addEventListener('click',()=>{search.value='';category=categories[0];limit=60;render();search.focus()});document.getElementById('checker').addEventListener('change',e=>document.body.classList.toggle('checkers',e.target.checked));
grid.addEventListener('click',e=>{const button=e.target.closest('[data-file]');if(!button)return;const sticker=stickers.find(s=>s.file===button.dataset.file);document.getElementById('preview-image').src=`stickers-2x/${sticker.file}`;document.getElementById('preview-image').alt=sticker.name;document.getElementById('preview-title').textContent=sticker.name;document.getElementById('preview-category').textContent=sticker.category;document.getElementById('preview-dimensions').textContent=`Original: ${sticker.width} × ${sticker.height} · Larger: ${sticker.width*2} × ${sticker.height*2}`;document.getElementById('preview-native').href=`stickers/${sticker.file}`;document.getElementById('preview-large').href=`stickers-2x/${sticker.file}`;preview.showModal()});
document.getElementById('close').addEventListener('click',()=>preview.close());preview.addEventListener('click',e=>{if(e.target!==preview)return;const r=preview.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)preview.close()});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!preview.open&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();search.focus()}});
fetch('assets/downloads.json').then(r=>r.json()).then(d=>{document.getElementById('all-size').textContent=`${Math.round(d.all)} MB`;document.getElementById('original-size').textContent=`Native resolution · ${Math.round(d.original)} MB ZIP`;document.getElementById('2x-size').textContent=`Twice the dimensions · ${Math.round(d['2x'])} MB ZIP`}).catch(()=>{});
render();
})();

(() => {
  const buttons = [...document.querySelectorAll('[data-theme-toggle]')];
  function apply(theme) {
    const light = theme === 'light';
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f2efdf' : '#333c43');
    for (const button of buttons) {
      const label = light ? 'Switch to dark mode' : 'Switch to light mode';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('.theme-icon').textContent = light ? '☾' : '☀';
      button.querySelector('.theme-label').textContent = light ? 'Dark mode' : 'Light mode';
    }
  }
  apply(document.documentElement.dataset.theme);
  buttons.forEach(button => button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    apply(theme);
    try { localStorage.setItem('sebi-theme', theme); } catch { /* Mode still works for this visit. */ }
  }));
  window.addEventListener('storage', event => {
    if (event.key === 'sebi-theme') apply(event.newValue === 'light' ? 'light' : 'dark');
  });
})();

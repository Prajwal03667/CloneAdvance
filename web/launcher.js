'use strict';
const fields = ['quality','fps','shadows'];
try {
  const saved = JSON.parse(localStorage.getItem('playgta5-enhanced-settings') || '{}');
  for (const name of fields) {
    const element = document.getElementById(name);
    if (name === 'shadows') element.checked = saved[name] === true;
    else if ([...element.options].some(o => o.value === saved[name])) element.value = saved[name];
  }
} catch {}
for (const button of document.querySelectorAll('[data-mode]')) button.onclick = () => {
  const quality = document.getElementById('quality').value, fps = document.getElementById('fps').value, shadows = document.getElementById('shadows').checked;
  try { localStorage.setItem('playgta5-enhanced-settings', JSON.stringify({quality,fps,shadows})); } catch {}
  const mode = button.dataset.mode;
  const query = new URLSearchParams({low:'1',res:quality,fps,shadows:shadows?'1':'0',mode:mode==='continue'||mode==='new'?'story':'sandbox'});
  if (mode === 'new') query.set('newgame','1');
  if (mode === 'dev') query.set('map','env_test');
  location.assign('/?' + query);
};
setInterval(() => {
  try {
    const pads = [...navigator.getGamepads()].filter(p => p?.connected);
    document.getElementById('controller-status').textContent = pads.length ? pads.map(p => p.mapping === 'standard' ? p.id + ' · standard mapping' : p.id + ' · unsupported mapping').join('\n') : 'Connect a controller and press a button.';
  } catch { document.getElementById('controller-status').textContent = 'Gamepad API unavailable. Use current Chrome/Edge on localhost or HTTPS.'; }
}, 1000);

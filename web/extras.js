(() => {
  'use strict';
  globalThis.PlayGTA5Extras = {install(input) {
    const {keys, w, U16, VK, canvas} = input;
    const panel = document.createElement('section');
    panel.id = 'extras-panel'; panel.hidden = true;
    panel.style.cssText = 'position:fixed;top:64px;left:16px;z-index:10002;background:#10171c;color:#eef4f8;padding:20px;width:min(420px,90vw);border:1px solid #52616b;border-radius:12px;font:15px/1.5 system-ui;max-height:75vh;overflow:auto';
    panel.innerHTML = '<h2>Controller & cheats</h2><p id="pad-status" role="status"></p><p>Click the game to capture the mouse. View + Menu switches on-foot/driving controls. F7 closes this panel.</p><hr><p>Experimental cheat entry: open the game cheat console first, then send a code. Codes can be unavailable during missions or in this snapshot. Keep a clean save.</p><button id="open-console">Open game cheat console</button><p><label>Code <select id="cheat-code"></select></label></p><button id="send-cheat">Send selected code</button><p id="cheat-status" role="status"></p><p>No money cheat, GTA Online vehicles, or multiplayer is supplied.</p><a href="/__enhanced/" style="color:#c5f099">Return to launcher (ends this session)</a>';
    const toggle = document.createElement('button'); toggle.textContent = 'Controller / cheats · F7';
    toggle.style.cssText = 'position:fixed;right:16px;bottom:12px;z-index:10001;padding:10px;background:#17232b;color:white;border:1px solid #536875;border-radius:6px';
    document.body.append(toggle, panel);
    const status = panel.querySelector('#pad-status'), message = panel.querySelector('#cheat-status');
    const controller = PlayGTA5Controller.attach({...input, active:() => !panel.hidden ? false : true,
      status:text => { if (status.textContent !== text) status.textContent = text; }});
    const modeButton = document.createElement('button'); modeButton.textContent = 'Switch to driving controls';
    modeButton.onclick = () => { modeButton.textContent = controller.toggleMode() ? 'Switch to on-foot controls' : 'Switch to driving controls'; };
    status.after(modeButton);
    function show() { panel.hidden = !panel.hidden; controller.release(); if (!panel.hidden) document.exitPointerLock(); }
    toggle.onclick = show;
    addEventListener('keydown', e => {
      if (e.code === 'F7') { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) show(); }
      else if (panel.contains(e.target)) e.stopImmediatePropagation();
    }, true);
    panel.addEventListener('mousedown', e => e.stopPropagation());
    const select = panel.querySelector('#cheat-code');
    fetch('/__enhanced/cheats.json').then(r => { if (!r.ok) throw Error('Catalog unavailable'); return r.json(); }).then(items => {
      for (const [code, label] of items) { const option = document.createElement('option'); option.value = code; option.textContent = label + ' — ' + code; select.append(option); }
    }).catch(e => { message.textContent = e.message; });
    panel.querySelector('#open-console').onclick = () => {
      Atomics.store(keys, VK.Backquote, 128);
      setTimeout(() => Atomics.store(keys, VK.Backquote, 0), 150);
      message.textContent = 'Check that the game cheat-code box is open before sending. Click again if you need to close it.';
    };
    panel.querySelector('#send-cheat').onclick = () => {
      const text = select.value;
      if (!/^[A-Z]{2,24}$/.test(text)) return;
      const head = Atomics.load(w, 8), tail = Atomics.load(w, 9);
      if (((head - tail) >>> 0) + text.length + 1 > 64) { message.textContent = 'Game input is busy. Wait and retry.'; return; }
      for (let i = 0; i < text.length; i++) U16[(head + i) & 63] = text.charCodeAt(i);
      U16[(head + text.length) & 63] = 13;
      Atomics.store(w, 8, (head + text.length + 1) | 0);
      message.textContent = 'Code sent to input. Check the game response; sending is not confirmation that the cheat activated.';
    };
  }};
})();

import { spawn } from 'node:child_process';
import fs from 'node:fs';

async function capture() {
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/chrome-ig-profile',
    '--window-size=1280,1200'
  ]);

  // wait 1s for chrome to start
  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const list = await listRes.json();
    const pageTarget = list.find(t => t.type === 'page');
    console.log('Page target:', pageTarget);
    if (!pageTarget) throw new Error('No page target');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise((resolve) => ws.addEventListener('open', resolve));
    console.log('WebSocket open');

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    console.log('Navigating to Instagram...');
    await send('Page.navigate', { url: 'https://www.instagram.com/matchababetx/' });

    // Wait for page to load
    await new Promise(r => setTimeout(r, 6000));

    // Remove dialogs and overlays
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || parseInt(style.zIndex, 10) > 10) {
              if (!el.contains(document.querySelector('main'))) {
                el.remove();
              }
            }
          });
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
          return 'cleaned overlays';
        })()
      `
    });
    console.log('Eval result:', evalRes);

    await new Promise(r => setTimeout(r, 1500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync('reference/ig_live_clean.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved reference/ig_live_clean.png');
    }
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

capture();

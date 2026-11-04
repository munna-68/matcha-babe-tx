import { spawn } from 'node:child_process';
import fs from 'node:fs';

async function capture() {
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/chrome-site-profile',
    '--window-size=1440,1100'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json/list');
    const list = await listRes.json();
    const pageTarget = list.find(t => t.type === 'page');
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

    await send('Page.enable');
    await send('Runtime.enable');

    // pre-set sessionStorage so preloader is bypassed
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `sessionStorage.setItem('mb-intro', '1');`
    });

    await send('Page.navigate', { url: 'http://localhost:3002/?labels=1' });
    await new Promise(r => setTimeout(r, 3500));

    // Scroll down to see season-feature and categories
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 2200);`
    });
    await new Promise(r => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync('reference/site_home_scrolled.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved reference/site_home_scrolled.png');
    }
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

capture();

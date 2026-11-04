import { spawn } from 'node:child_process';
import fs from 'node:fs';

async function capturePages() {
  const port = 9228;
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/chrome-site-profile-menu',
    '--window-size=1440,1400'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
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

    // pre-set sessionStorage
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `sessionStorage.setItem('mb-intro', '1');`
    });

    // Capture Menu
    await send('Page.navigate', { url: 'http://localhost:3000/menu' });
    await new Promise(r => setTimeout(r, 2500));
    const menuShot = await send('Page.captureScreenshot', { format: 'png' });
    if (menuShot && menuShot.data) {
      fs.writeFileSync('reference/site_menu.png', Buffer.from(menuShot.data, 'base64'));
      console.log('Saved reference/site_menu.png');
    }

    // Capture Gallery
    await send('Page.navigate', { url: 'http://localhost:3000/gallery' });
    await new Promise(r => setTimeout(r, 2500));
    const galleryShot = await send('Page.captureScreenshot', { format: 'png' });
    if (galleryShot && galleryShot.data) {
      fs.writeFileSync('reference/site_gallery.png', Buffer.from(galleryShot.data, 'base64'));
      console.log('Saved reference/site_gallery.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

capturePages();

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const igDir = path.resolve('reference/ig_posts');
  if (!fs.existsSync(igDir)) fs.mkdirSync(igDir, { recursive: true });

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/chrome-ig-profile-fetch',
    '--window-size=1280,1600'
  ]);

  let list = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9227/json/list');
      list = await res.json();
      break;
    } catch {}
  }

  if (!list) {
    console.error('Could not connect to Chrome');
    chrome.kill('SIGKILL');
    return;
  }

  const pageTarget = list.find(t => t.type === 'page');
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

  console.log('Navigating to Instagram @matchababetx...');
  await send('Page.navigate', { url: 'https://www.instagram.com/matchababetx/' });
  await new Promise(r => setTimeout(r, 5000));

  // Dismiss login dialogs and banners
  await send('Runtime.evaluate', {
    expression: `
      document.querySelectorAll("[role=dialog], div[tabindex='-1']").forEach(d => {
        if (!d.contains(document.querySelector("main"))) d.remove();
      });
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    `
  });

  const allImages = new Map();

  for (let scroll = 0; scroll < 10; scroll++) {
    const res = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll("img")).map(img => ({
          src: img.src,
          alt: img.alt || "",
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height
        }))
      `,
      returnByValue: true
    });

    for (const item of (res.result?.value || [])) {
      if (item.w > 200 && item.src.includes('cdninstagram')) {
        const key = item.src.split('?')[0];
        if (!allImages.has(key)) {
          allImages.set(key, item);
        }
      }
    }

    // Scroll down
    await send('Runtime.evaluate', {
      expression: 'window.scrollBy(0, 1200);'
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`Found ${allImages.size} unique image URLs from Instagram feed.`);

  let idx = 0;
  for (const [key, item] of allImages.entries()) {
    idx++;
    try {
      const imgRes = await fetch(item.src);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const baseName = `ig_${String(idx).padStart(2, '0')}`;
      fs.writeFileSync(path.join(igDir, `${baseName}.jpg`), buf);
      fs.writeFileSync(path.join(igDir, `${baseName}.txt`), `${item.alt}\n${item.src}\n`);
      console.log(`Saved ${baseName}.jpg (${buf.length} bytes): ${item.alt.slice(0, 70)}`);
    } catch (e) {
      console.error(`Failed to download ${key}:`, e.message);
    }
  }

  ws.close();
  chrome.kill('SIGKILL');
  console.log('Done downloading Instagram feed images.');
}

main().catch(console.error);

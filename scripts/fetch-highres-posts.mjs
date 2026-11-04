import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('reference/highres_posts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const posts = [
  'https://www.instagram.com/matchababetx/p/DeiIAJAiSvo/',
  'https://www.instagram.com/matchababetx/p/DeSBJDoCfoT/',
  'https://www.instagram.com/matchababetx/p/DeM3rj0Jd4J/',
  'https://www.instagram.com/matchababetx/p/DeHwSJgpe4H/',
  'https://www.instagram.com/matchababetx/p/DeChdtcvEHJ/',
  'https://www.instagram.com/matchababetx/p/Dd65gECCf96/',
  'https://www.instagram.com/matchababetx/p/Dd4TR6UJnzd/',
  'https://www.instagram.com/matchababetx/p/Ddy13Z1oNRc/',
  'https://www.instagram.com/matchababetx/p/Ddwv1qEJ9hU/',
  'https://www.instagram.com/matchababetx/p/DdecdUhvc21/',
  'https://www.instagram.com/matchababetx/p/Dcl0sgyIG2D/',
  'https://www.instagram.com/matchababetx/p/Db81KayCZWP/'
];

async function main() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=/tmp/chrome-ig-highres-2',
    '--window-size=1440,1200'
  ]);

  let list = null;
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9234/json/list');
      list = await res.json();
      break;
    } catch {}
  }
  if (!list) { chrome.kill('SIGKILL'); return; }

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

  let postIndex = 0;
  for (const postUrl of posts) {
    postIndex++;
    const shortcode = postUrl.split('/p/')[1].replace('/', '');
    console.log(`[${postIndex}/${posts.length}] Fetching ${shortcode}...`);
    await send('Page.navigate', { url: postUrl });
    await new Promise(r => setTimeout(r, 3000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll("img")).map(img => ({
          src: img.src,
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height
        }))
      `,
      returnByValue: true
    });

    const imgs = evalRes.result?.value || [];
    let saved = 0;
    for (const item of imgs) {
      if ((item.w >= 600 || item.h >= 600 || item.src.includes('1080')) && !item.src.includes('150x150')) {
        saved++;
        try {
          const res = await fetch(item.src);
          const buf = Buffer.from(await res.arrayBuffer());
          const fileName = `${shortcode}_${saved}.jpg`;
          fs.writeFileSync(path.join(outDir, fileName), buf);
          console.log(`  ✓ Saved ${fileName} (${item.w}x${item.h}, ${buf.length} bytes)`);
        } catch (e) {
          console.error('  Failed to fetch', item.src, e.message);
        }
      }
    }
    if (saved === 0) {
      console.log(`  No high-res found for ${shortcode}, imgs count was ${imgs.length}`);
    }
  }

  ws.close();
  chrome.kill('SIGKILL');
  console.log('Finished fetching all high-res posts.');
}

main().catch(console.error);

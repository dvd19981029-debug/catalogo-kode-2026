const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function capture(url, outputFile, width, height, isMobile) {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    url
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const listRes = await fetch('http://127.0.0.1:9226/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.type === 'page' && t.url.includes('localhost')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    await new Promise(resolve => ws.addEventListener('open', resolve));

    let reqId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = reqId++;
        const handler = (e) => {
          const data = JSON.parse(e.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });

    await new Promise(r => setTimeout(r, 800));

    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });

    fs.writeFileSync(outputFile, Buffer.from(screenshot.data, 'base64'));
    console.log(`Saved screenshot to ${outputFile} (${width}x${height})`);

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Capture error:', err);
    chrome.kill();
  }
}

async function main() {
  const targetUrl = process.argv[2] || 'http://localhost:3000/producto.html?k=343';
  const outMobile = path.join(__dirname, '../shot_device_mobile_ok.png');
  const outDesktop = path.join(__dirname, '../shot_device_desktop_ok.png');

  await capture(targetUrl, outMobile, 390, 844, true);
  await new Promise(r => setTimeout(r, 600));
  await capture(targetUrl, outDesktop, 1280, 800, false);
  process.exit(0);
}

main();

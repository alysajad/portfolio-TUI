import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ssh2 from 'ssh2';
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';
import { Writable } from 'node:stream';

const { Server } = ssh2;

// ── Resolve __dirname in ESM ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuration ──
const PORT = parseInt(process.env.PORT || '2222', 10);
const HOST_KEY_PATH = path.join(__dirname, '..', 'host_key');

// ── Rate Limiting ──
const connections = new Map<string, number>();
const MAX_CONNECTIONS_PER_IP = 5;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastTime = connections.get(ip);
  if (lastTime && now - lastTime < RATE_WINDOW_MS) {
    return false;
  }
  connections.set(ip, now);
  return true;
}

// ── Load host key ──
let hostKey: Buffer;
try {
  hostKey = fs.readFileSync(HOST_KEY_PATH);
} catch {
  console.error(
    `Host key not found at ${HOST_KEY_PATH}.\n` +
    `Generate one with: ssh-keygen -t rsa -b 4096 -f host_key -N ""`
  );
  process.exit(1);
}

// ── Create SSH Server ──
const server = new Server(
  {
    hostKeys: [hostKey],
  },
  (client: any) => {
    const clientAddr =
      (client as any)._sock?.remoteAddress || 'unknown';

    client.on('error', (err: Error) => {
      // Ignore routine connection drops
    });

    client.on('authentication', (ctx: any) => {
      // Accept all authentication — anonymous access
      ctx.accept();
    });

    client.on('ready', () => {
      client.on('session', (accept: any) => {
        const session = accept();

        let columns = 80;
        let rows = 24;

        session.on('pty', (accept: any, reject: any, info: any) => {
          columns = info.cols;
          rows = info.rows;
          accept();
        });

        session.on('window-change', (accept: any, reject: any, info: any) => {
          columns = info.cols;
          rows = info.rows;
        });

        session.on('shell', (accept: any) => {
          const stream = accept();

          // Mock TTY required by Ink for Stdin
          Object.defineProperty(stream, 'isTTY', { value: true });
          stream.setRawMode = () => {};
          stream.ref = stream.ref || (() => {});
          stream.unref = stream.unref || (() => {});
          stream.columns = columns;
          stream.rows = rows;

          // Create an intercepted Writable stream for Stdout to fix PTY newlines
          const stdout = new Writable({
            write(chunk, encoding, callback) {
              let str = chunk.toString('utf8');
              // Replace any \n not preceded by \r with \r\n
              str = str.replace(/(?<!\r)\n/g, '\r\n');
              stream.write(str, callback);
            }
          });
          Object.defineProperty(stdout, 'isTTY', { value: true });
          (stdout as any).columns = columns;
          (stdout as any).rows = rows;

          // Propagate resize events to Ink
          session.on('window-change', (accept: any, reject: any, info: any) => {
            stream.columns = info.cols;
            stream.rows = info.rows;
            (stdout as any).columns = info.cols;
            (stdout as any).rows = info.rows;
            stdout.emit('resize');
            stream.emit('resize');
            if (accept) accept();
          });

          // Render Ink app to the SSH stream
          const { unmount, waitUntilExit } = render(
            React.createElement(App),
            {
              stdout: stdout as any,
              stdin: stream as any,
              exitOnCtrlC: true,
            }
          );

          // Clean up on stream close
          stream.on('close', () => {
             unmount();
          });
          stream.on('error', () => {
             unmount();
          });
          stdout.on('error', () => {
             // ignore
          });

          // Wait for app exit then end the stream
          waitUntilExit().then(() => {
            stream.close();
          }).catch(() => {
            stream.close();
          });
        });
      });
    });

    client.on('end', () => {
      // client disconnected
    });
  }
);

// ── Start Server ──
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║  SSH Terminal Portfolio Server                ║`);
  console.log(`║  Listening on port ${PORT}                       ║`);
  console.log(`║                                              ║`);
  console.log(`║  Connect with:                               ║`);
  console.log(`║  ssh -p ${PORT} localhost                        ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[SSH] Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  console.log('\n[SSH] Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});

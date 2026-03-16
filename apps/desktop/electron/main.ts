import { app, BrowserWindow } from 'electron';
import { existsSync } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { registerTerminalIpcHandlers } from './ipc/terminal.ipc.ts';
import { registerWorkflowIpcHandlers } from './ipc/workflow.ipc.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null;

function createWindow() {
  const localPreloadPath = path.join(__dirname, 'preload.js');
  const distPreloadPath = path.join(process.cwd(), 'dist-electron', 'preload.js');
  const preloadPath = existsSync(localPreloadPath) ? localPreloadPath : distPreloadPath;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false, // Güvenlik için kapalı olmalı
      contextIsolation: true, // Güvenlik için açık olmalı
    },
  });

  // Geliştirme aşamasındaysak Vite'in dev server'ına bağlan
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools(); // Geliştirici araçlarını aç
  } else {
    // Prod ortamındaysak React'in derlenmiş index.html dosyasını yükle
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  registerTerminalIpcHandlers();
  registerWorkflowIpcHandlers();
  createWindow();
});
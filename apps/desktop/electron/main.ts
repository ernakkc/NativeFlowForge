import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { registerTerminalIpcHandlers } from './ipc/terminal.ipc.ts';
import { registerWorkflowIpcHandlers } from './ipc/workflow.ipc.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null;

function createWindow() {
    const preloadPath = path.join(process.cwd(), 'dist/electron/preload.js');

    if (!preloadPath) {
        throw new Error(`Preload script not found. Checked paths: ${preloadPath}`);
    }

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false, // Güvenlik için kapalı olmalı
            contextIsolation: true, // Güvenlik için açık olmalı
            sandbox: false, // ESM preload dosyasının dev/prod aynı şekilde çalışması için
        },
    });

    // Geliştirme aşamasındaysak Vite'in dev server'ına bağlan
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools(); // Geliştirici araçlarını aç
    } else {
        // Prod ortamındaysak React'in derlenmiş index.html dosyasını yükle
        const indexPath = path.join(__dirname, '../index.html');

        if (!indexPath) {
            throw new Error(`Renderer index not found. Checked paths: ${indexPath}`);
        }

        mainWindow.loadFile(indexPath);
    }
}

app.whenReady().then(() => {
    registerTerminalIpcHandlers();
    registerWorkflowIpcHandlers();
    createWindow();
});
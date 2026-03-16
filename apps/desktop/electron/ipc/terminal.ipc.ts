import { ipcMain } from 'electron';
import { Terminal } from '../../../../packages/nodes/terminal.ts';

type TerminalRunResult =
  | { ok: true; stdout: string }
  | { ok: false; error: string };

export function registerTerminalIpcHandlers() {
  ipcMain.removeHandler('terminal:run');

  ipcMain.handle('terminal:run', async (_event, command: string): Promise<TerminalRunResult> => {
    try {
      const terminal = new Terminal();
      const result = await terminal.execute({ command }, {});
      return { ok: true, stdout: String(result.stdout ?? '') };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown terminal execution error';
      return { ok: false, error: message };
    }
  });
}

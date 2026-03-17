import { app, ipcMain } from 'electron';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { WorkflowDocument, WorkflowRunRequest, WorkflowRunResponse } from '../../../../packages/shared/types';
import { runWorkflowFromTrigger } from '../../../../packages/engine/executor';

type WorkflowSaveResult =
  | { ok: true; filePath: string }
  | { ok: false; error: string };

export function registerWorkflowIpcHandlers() {
  ipcMain.removeHandler('workflow:save');
  ipcMain.removeHandler('workflow:run');

  ipcMain.handle('workflow:save', async (_event, workflowData: WorkflowDocument): Promise<WorkflowSaveResult> => {
    try {
      const now = Date.now();
      const workflowId = workflowData?.id || `wf_${now}`;
      const workflowsDir = path.join(app.getPath('userData'), 'workflows');
      const filePath = path.join(workflowsDir, `${workflowId}.json`);

      const payload: WorkflowDocument = {
        ...workflowData,
        id: workflowId,
        createdAt: workflowData?.createdAt ?? now,
        updatedAt: now,
      };

      await mkdir(workflowsDir, { recursive: true });
      await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');

      return { ok: true, filePath };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown workflow save error';
      return { ok: false, error: message };
    }
  });

  ipcMain.handle('workflow:run', async (_event, payload: WorkflowRunRequest): Promise<WorkflowRunResponse> => {
    return runWorkflowFromTrigger(payload.workflow, payload.triggerNodeId);
  });
}

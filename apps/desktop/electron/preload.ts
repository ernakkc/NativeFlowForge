import { contextBridge, ipcRenderer } from 'electron';
import type {
  WorkflowDocument,
  WorkflowRunRequest,
  WorkflowRunResponse,
} from '../../../packages/shared/types';

// React tarafından erişilebilecek API'leri tanımlıyoruz
contextBridge.exposeInMainWorld('electronAPI', {
  // Örnek: Terminal node'u için bir komut çalıştırma isteği
  runTerminalCommand: (command: string) => ipcRenderer.invoke('terminal:run', command),
  
  // Örnek: Workflow'u kaydetme
  saveWorkflow: (workflowData: WorkflowDocument) => ipcRenderer.invoke('workflow:save', workflowData),

  runWorkflow: (payload: WorkflowRunRequest): Promise<WorkflowRunResponse> =>
    ipcRenderer.invoke('workflow:run', payload),

});
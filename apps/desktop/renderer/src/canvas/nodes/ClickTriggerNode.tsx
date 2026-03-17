import { Handle, Position, type NodeProps } from '@xyflow/react';
import useWorkflowStore from '../../store/workflow.store';
import type {
  WorkflowDocument,
  TriggerRunRequestDetail,
  WorkflowNodeRunResult,
  WorkflowRunResponse,
} from '@nff/shared/types';

type WorkflowSaveResult =
  | { ok: true; filePath: string }
  | { ok: false; error: string };

type ElectronAPI = {
  saveWorkflow: (workflowData: WorkflowDocument) => Promise<WorkflowSaveResult>;
  runWorkflow: (workflowData: WorkflowDocument, triggerNodeId: string) => Promise<WorkflowRunResponse>;
};

function ClickTriggerNode({ id, data }: NodeProps) {
  const { getWorkflowJSON, updateNodeData, removeNode } = useWorkflowStore();

  const status = typeof data?.status === 'string' ? data.status : 'idle';
  const summary = typeof data?.summary === 'string' ? data.summary : 'Hazir';

  const handleDelete = () => {
    removeNode(id);
  };

  const handleRunTrigger = async () => {
    const requestedAt = Date.now();
    const { nodes: workflowNodes, edges: workflowEdges } = getWorkflowJSON();

    const workflowDocument: WorkflowDocument = {
      id: `wf_${requestedAt}`,
      name: 'Click Trigger',
      description: 'Click Trigger is starting the workflow',
      nodes: workflowNodes,
      edges: workflowEdges,
      createdAt: requestedAt,
      updatedAt: requestedAt,
    };

    const detail: TriggerRunRequestDetail = {
      triggerNodeId: id,
      triggerType: 'click',
      requestedAt,
      workflow: {
        nodes: workflowNodes,
        edges: workflowEdges,
      },
    };

    window.dispatchEvent(new CustomEvent<TriggerRunRequestDetail>('nff:trigger-run-requested', { detail }));

    updateNodeData(id, {
      status: 'running',
      summary: `Trigger running (${new Date(requestedAt).toLocaleTimeString()})`,
      requestedAt,
    });

    try {
      const electronAPI = (window as Window & { electronAPI?: ElectronAPI }).electronAPI;

      if (!electronAPI?.runWorkflow) {
        updateNodeData(id, {
          status: 'error',
          summary: 'runWorkflow API bulunamadi. Uygulamayi Electron ile ac.',
        });
        return;
      }

      if (electronAPI.saveWorkflow) {
        const saveResult = await electronAPI.saveWorkflow(workflowDocument);
        if (!saveResult.ok) {
          updateNodeData(id, {
            status: 'running',
            summary: `Kayit uyarisi: ${saveResult.error} | akis yine de calisiyor`,
          });
        }
      }

      const execution = await electronAPI.runWorkflow(workflowDocument, id);

      if (!execution.ok) {
        updateNodeData(id, {
          status: 'error',
          summary: `Akis baslatilamadi: ${execution.error}`,
        });
        return;
      }

      const terminalResults = execution.results.filter(
        (item: WorkflowNodeRunResult) => item.nodeType === 'terminal',
      );

      for (const result of terminalResults) {
        if (result.status === 'success') {
          updateNodeData(result.nodeId, {
            lastOutput: result.output ?? '',
            lastError: '',
            lastRunAt: Date.now(),
          });
        } else if (result.status === 'failed') {
          updateNodeData(result.nodeId, {
            lastOutput: '',
            lastError: result.error ?? 'Terminal node calismasi basarisiz',
            lastRunAt: Date.now(),
          });
        }
      }

      if (execution.summary.total === 0) {
        updateNodeData(id, {
          status: 'idle',
          summary: 'Triggere bagli node yok',
        });
      } else if (execution.summary.failed > 0) {
        updateNodeData(id, {
          status: 'error',
          summary: `Akis tamamlandi | basarili: ${execution.summary.success}, hatali: ${execution.summary.failed}, atlanan: ${execution.summary.skipped}`,
        });
      } else {
        updateNodeData(id, {
          status: 'success',
          summary: `Akis tamamlandi | basarili: ${execution.summary.success}, atlanan: ${execution.summary.skipped}`,
        });
      }
    } catch (error: unknown) {
      updateNodeData(id, {
        status: 'error',
        summary: error instanceof Error ? error.message : 'Workflow kaydi sirasinda bilinmeyen hata',
      });
    }
  };

  return (
    <div
      style={{
        background: '#1a140b',
        color: '#ffce8a',
        border: '1px solid #8b6f3d',
        borderRadius: '8px',
        padding: '10px',
        width: '300px',
        fontFamily: 'monospace',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #8b6f3d',
          paddingBottom: '5px',
          marginBottom: '10px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>▶ Click Trigger</span>
        <button
          onClick={handleDelete}
          style={{
            background: '#ff0000',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          ✕
        </button>
      </div>

      <button
        onClick={() => {
          void handleRunTrigger();
        }}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 10px',
          cursor: 'pointer',
          background: '#f4b74d',
          color: '#121212',
          fontWeight: 'bold',
        }}
      >
        Run Trigger
      </button>

      <div style={{ marginTop: '8px', fontSize: '12px', color: '#d7b27a' }}>
        <div>Durum: {status}</div>
        <div>{summary}</div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#8b6f3d' }} />
    </div>
  );
}

export default ClickTriggerNode;

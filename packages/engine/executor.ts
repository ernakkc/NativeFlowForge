import { getReachableNodeOrder } from './dag';
import type { WorkflowDocument, WorkflowNodeRunResult, WorkflowRunResponse } from '../shared/types';
import { Terminal } from '../nodes/terminal';

export async function runWorkflowFromTrigger(
  workflow: WorkflowDocument,
  triggerNodeId: string,
): Promise<WorkflowRunResponse> {
  try {
    const orderedNodeIds = getReachableNodeOrder(triggerNodeId, workflow.nodes, workflow.edges);
    const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
    const results: WorkflowNodeRunResult[] = [];

    for (const nodeId of orderedNodeIds) {
      const node = nodeById.get(nodeId);
      if (!node) {
        results.push({
          nodeId,
          nodeType: 'unknown',
          status: 'skipped',
          error: 'Node not found in workflow document',
        });
        continue;
      }

      if (node.type !== 'terminal') {
        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'skipped',
        });
        continue;
      }

      const command = typeof node.data?.command === 'string' ? node.data.command.trim() : '';
      if (!command) {
        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'failed',
          error: 'Command cannot be empty',
        });
        continue;
      }

      try {
        const terminal = new Terminal();
        const output = await terminal.execute({ command }, {});

        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'success',
          output: String(output?.stdout ?? ''),
        });
      } catch (error: unknown) {
        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown terminal execution error',
        });
      }
    }

    const summary = {
      total: results.length,
      success: results.filter((item) => item.status === 'success').length,
      failed: results.filter((item) => item.status === 'failed').length,
      skipped: results.filter((item) => item.status === 'skipped').length,
    };

    return {
      ok: true,
      results,
      summary,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown workflow execution error',
    };
  }
}

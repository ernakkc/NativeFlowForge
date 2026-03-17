import { buildExecutionPlan } from './dag';
import type {
  NodeInputs,
  WorkflowDocument,
  WorkflowNodeRunResult,
  WorkflowRunResponse,
} from '../shared/types';
import { createDefaultNodePluginRegistry, type NodePluginRegistry } from '../nodes/registry';

interface RunWorkflowOptions {
  nodePluginRegistry?: NodePluginRegistry;
}

function toOutputText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && 'stdout' in value) {
    const maybeStdout = (value as { stdout?: unknown }).stdout;
    return typeof maybeStdout === 'string' ? maybeStdout : String(maybeStdout ?? '');
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export async function runWorkflowFromTrigger(
  workflow: WorkflowDocument,
  triggerNodeId: string,
  options: RunWorkflowOptions = {},
): Promise<WorkflowRunResponse> {
  try {
    const pluginRegistry = options.nodePluginRegistry ?? createDefaultNodePluginRegistry();
    const executionPlan = buildExecutionPlan(triggerNodeId, workflow.nodes, workflow.edges);
    const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
    const outputByNodeId = new Map<string, unknown>();
    const results: WorkflowNodeRunResult[] = [];

    for (const nodeId of executionPlan.orderedNodeIds) {
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

      const plugin = pluginRegistry.get(String(node.type));
      if (!plugin) {
        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'skipped',
          error: `No plugin registered for node type: ${String(node.type)}`,
        });
        continue;
      }

      const parentNodeIds = executionPlan.incomingByNode.get(node.id) ?? [];
      const nodeInputs: NodeInputs = {};

      for (const parentNodeId of parentNodeIds) {
        if (!outputByNodeId.has(parentNodeId)) {
          continue;
        }
        nodeInputs[parentNodeId] = outputByNodeId.get(parentNodeId);
      }

      const startTime = Date.now();

      try {
        const outputData = await plugin.execute(node.data, nodeInputs);
        const endTime = Date.now();
        outputByNodeId.set(node.id, outputData);

        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'success',
          output: toOutputText(outputData),
          data: outputData,
          startTime,
          endTime,
        });
      } catch (error: unknown) {
        const endTime = Date.now();
        results.push({
          nodeId: node.id,
          nodeType: node.type,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown terminal execution error',
          startTime,
          endTime,
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

import type { NFFEdge, NFFNode } from '../shared/types';

export interface ExecutionPlan {
  orderedNodeIds: string[];
  incomingByNode: Map<string, string[]>;
}

function collectReachableNodeIds(
  triggerNodeId: string,
  nodes: NFFNode[],
  edges: NFFEdge[],
): Set<string> {
  const outgoing = new Map<string, string[]>();

  for (const node of nodes) {
    outgoing.set(node.id, []);
  }

  for (const edge of edges) {
    const current = outgoing.get(edge.source) ?? [];
    outgoing.set(edge.source, [...current, edge.target]);
  }

  const visited = new Set<string>([triggerNodeId]);
  const queue: string[] = [triggerNodeId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) {
      continue;
    }

    for (const nextId of outgoing.get(currentId) ?? []) {
      if (visited.has(nextId)) {
        continue;
      }

      visited.add(nextId);
      queue.push(nextId);
    }
  }

  return visited;
}

export function buildExecutionPlan(
  triggerNodeId: string,
  nodes: NFFNode[],
  edges: NFFEdge[],
): ExecutionPlan {
  const reachable = collectReachableNodeIds(triggerNodeId, nodes, edges);
  const orderedCandidates = nodes
    .map((node) => node.id)
    .filter((nodeId) => nodeId !== triggerNodeId && reachable.has(nodeId));

  const incomingByNode = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  for (const nodeId of orderedCandidates) {
    incomingByNode.set(nodeId, []);
    indegree.set(nodeId, 0);
    outgoing.set(nodeId, []);
  }

  for (const edge of edges) {
    if (!reachable.has(edge.source) || !reachable.has(edge.target)) {
      continue;
    }

    if (edge.target === triggerNodeId) {
      continue;
    }

    if (!indegree.has(edge.target)) {
      continue;
    }

    incomingByNode.set(edge.target, [...(incomingByNode.get(edge.target) ?? []), edge.source]);

    if (outgoing.has(edge.source)) {
      outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target]);
    }

    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  }

  const queue = orderedCandidates.filter((nodeId) => (indegree.get(nodeId) ?? 0) === 0);
  const orderedNodeIds: string[] = [];

  while (queue.length > 0) {
    const currentNodeId = queue.shift();
    if (!currentNodeId) {
      continue;
    }

    orderedNodeIds.push(currentNodeId);

    for (const targetNodeId of outgoing.get(currentNodeId) ?? []) {
      const nextDegree = (indegree.get(targetNodeId) ?? 0) - 1;
      indegree.set(targetNodeId, nextDegree);

      if (nextDegree === 0) {
        queue.push(targetNodeId);
      }
    }
  }

  if (orderedNodeIds.length < orderedCandidates.length) {
    const inOrderRemainder = orderedCandidates.filter((nodeId) => !orderedNodeIds.includes(nodeId));
    orderedNodeIds.push(...inOrderRemainder);
  }

  return {
    orderedNodeIds,
    incomingByNode,
  };
}

import type { NFFEdge, NFFNode } from '../shared/types';

export function getReachableNodeOrder(
  triggerNodeId: string,
  nodes: NFFNode[],
  edges: NFFEdge[],
): string[] {
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
  const orderedNodeIds: string[] = [];

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
      orderedNodeIds.push(nextId);
    }
  }

  return orderedNodeIds;
}

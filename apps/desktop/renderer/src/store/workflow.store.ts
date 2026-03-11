import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type Connection, type NodeChange, type EdgeChange } from '@xyflow/react';
import type { NFFNode, NFFEdge } from '@nff/shared/types';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  getWorkflowJSON: () => { nodes: NFFNode[]; edges: NFFEdge[] }; 
}

const initialNodes: Node[] = []; // Ekranı başlangıçta bomboş sürekleyebilmek için

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  
  // Kutuyu hafızaya yazan yeni fonksiyonumuz
  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  removeNode: (nodeId) => {
    set({ nodes: get().nodes.filter((n) => n.id !== nodeId) });
  },

  getWorkflowJSON: () => {
    const { nodes, edges } = get();

    const nffNodes: NFFNode[] = nodes.map((n) => ({
      id: n.id,
      type: n.type || 'unknown',
      data: n.data,
      position: n.position
    }));

    const nffEdges: NFFEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || undefined,
      targetHandle: e.targetHandle || undefined
    }));

    return { nodes: nffNodes, edges: nffEdges };
  }
}));

export default useWorkflowStore;
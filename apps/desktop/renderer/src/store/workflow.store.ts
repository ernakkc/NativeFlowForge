import { create } from 'zustand';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  type Node, 
  type Edge, 
  type Connection, 
  type NodeChange, 
  type EdgeChange 
} from '@xyflow/react';

// KISAYOLUMUZ ÇALIŞIYOR: yazılan tipleri içeri alıyoruz
import type { NFFNode, NFFEdge } from '@nff/shared/types';

// ZUSTAND HAFIZAMIZIN SÖZLÜĞÜ (TypeScript'e söz veriyoruz)
interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  // Motorun beklediği node ve edge tiplerini döneceğini taahhüt ediyoruz
  getWorkflowJSON: () => { nodes: NFFNode[]; edges: NFFEdge[] }; 
}

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'terminal', 
    position: { x: 300, y: 200 }, 
    data: { command: 'ls -la' } // NFFNode yapısına uygun bir data
  }
];

// 2. BEYİN
const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  
  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    });
  },

  // (Adapter Pattern)
  getWorkflowJSON: () => {
    const { nodes, edges } = get();

    // React Flow düğümleri  NFFNode modeline çevrildi
    const nffNodes: NFFNode[] = nodes.map((node) => ({
      id: node.id,
      type: node.type || 'unknown',
      data: node.data,
      position: node.position
    }));

    // React Flow kenarları istenilen NFFEdge modeline çevrildi
    const nffEdges: NFFEdge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined
    }));

    return {
      nodes: nffNodes,
      edges: nffEdges
    };
  }
}));

export default useWorkflowStore;
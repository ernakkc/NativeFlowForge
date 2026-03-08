// @ts-nocheck
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const initialNodes = [
  { id: '1', type: 'terminal', position: { x: 300, y: 200 }, data: { label: 'İlk Terminalim' } }
];

const useWorkflowStore = create((set, get) => ({
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

  getWorkflowJSON: () => {
    return {
      nodes: get().nodes,
      edges: get().edges
    };
  }
}));

export default useWorkflowStore;
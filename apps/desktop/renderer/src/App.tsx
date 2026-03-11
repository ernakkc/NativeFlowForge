import React from 'react';
import { ReactFlow, Background, Controls, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TerminalNode from './canvas/nodes/TerminalNode';
import useWorkflowStore from './store/workflow.store'; 

// yazılan ana belge tipini çekiyoruz
import type { WorkflowDocument } from '@nff/shared/types';

// React Flow için Node tanımlaması (Tipini NodeTypes olarak belirttik)
const nodeTypes: NodeTypes = {
  terminal: TerminalNode,
};

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, getWorkflowJSON } = useWorkflowStore();

  const handleExportJSON = () => {
    // 1. Store'dan, motorun anlayacağı dildeki NFF Node ve Edge'leri alıyoruz
    const { nodes: nffNodes, edges: nffEdges } = getWorkflowJSON();

    // 2.  (WorkflowDocument) %100 uyan o ana objeyi yaratıyoruz
    const workflowDocument: WorkflowDocument = {
      id: `wf_${Date.now()}`, // Şimdilik id'yi rastgele zamana göre atadık
      name: "My First NFF Workflow", 
      description: "UI üzerinden oluşturulan ilk akıllı harita",
      nodes: nffNodes,
      edges: nffEdges,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("🔥 İSTENEN MOTOR ÇIKTISI:", workflowDocument);

    // 3.  Browser-compatible indirme kodu
    const jsonString = JSON.stringify(workflowDocument, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nff_workflow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1e1e1e', position: 'relative' }}>
      
      <button 
        onClick={handleExportJSON}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 10,
          padding: '10px 20px', background: '#00ff00', color: '#000',
          border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        Export Workflow
      </button>

      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes} 
      >
        <Background color="#555" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
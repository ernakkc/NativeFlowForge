// @ts-nocheck
import React from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TerminalNode from './canvas/nodes/TerminalNode';
import useWorkflowStore from './store/workflow.store'; 



// packages/shared/types.ts  TİPLERİ VE INTERFACELERİ BU DOSYADA TANIMLADIK ORADAN İÇERİ AKTAR
const nodeTypes = {
  terminal: TerminalNode,
};
//



function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, getWorkflowJSON } = useWorkflowStore();

  const handleExportJSON = () => {
    const workflowData = getWorkflowJSON();
    console.log("İSTENEN JSON ÇIKTISI:", JSON.stringify(workflowData, null, 2));

    // Browser-compatible dosya indirme
    const jsonString = JSON.stringify(workflowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert("JSON çıktısı başarıyla indirildi!");
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
        Export JSON
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
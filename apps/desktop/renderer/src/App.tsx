import React, { useRef, useCallback } from 'react';
import { ReactFlow, Background, Controls, ReactFlowProvider, useReactFlow, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TerminalNode from './canvas/nodes/TerminalNode';
import AIAnalyzerNode from './canvas/nodes/AIAnalyzerNode';
import ClickTriggerNode from './canvas/nodes/ClickTriggerNode';
import useWorkflowStore from './store/workflow.store'; 
import Sidebar from './components/Sidebar';
import type { WorkflowDocument } from '@nff/shared/types';

const nodeTypes: NodeTypes = {
  terminal: TerminalNode,
  ai_analyzer: AIAnalyzerNode,
  click_trigger: ClickTriggerNode,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, getWorkflowJSON, addNode } = useWorkflowStore();

  const handleExportJSON = () => {
    const { nodes: nffNodes, edges: nffEdges } = getWorkflowJSON();
    const workflowDocument: WorkflowDocument = {
      id: `wf_${Date.now()}`,
      name: "NFF Drag & Drop Workflow", 
      description: "UI üzerinden oluşturuldu",
      nodes: nffNodes,
      edges: nffEdges,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("🔥 MOTOR ÇIKTISI:", workflowDocument);
    const blob = new Blob([JSON.stringify(workflowDocument, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'nff_workflow.json';
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    
    // ID formatı
    const newNodeId = `${type}_${Date.now()}`;

    const newNode = {
      id: newNodeId,
      type,
      position,
      data:
        type === 'terminal'
          ? { command: 'ls -la' }
          : type === 'click_trigger'
            ? { status: 'idle', summary: 'Hazir' }
            : {},
    };

    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#1e1e1e' }}>
      <Sidebar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flexGrow: 1, position: 'relative' }}>
        <button 
          onClick={handleExportJSON}
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, padding: '10px 20px', background: '#00ff00', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Export JSON
        </button>
        <ReactFlow 
          nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes}
          onDrop={onDrop} onDragOver={onDragOver} fitView
        >
          <Background color="#555" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
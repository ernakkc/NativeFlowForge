import React from 'react';
import type { NodeType } from '@nff/shared/types';

function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: '250px', background: '#161b22', borderRight: '1px solid #30363d', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', color: '#c9d1d9', fontFamily: 'monospace' }}>
      <h3 style={{ margin: 0, borderBottom: '1px solid #30363d', paddingBottom: '10px', color: '#fff' }}>
        &gt;_ Araç Kutusu
      </h3>
      
      <p style={{ fontSize: '12px', color: '#8b949e', margin: 0 }}>
        Düğümleri (Nodes) tutup sağdaki alana sürükle.
      </p>

      <div 
        onDragStart={(event) => onDragStart(event, 'terminal')} 
        draggable 
        style={{ padding: '10px', border: '1px solid #00ff00', borderRadius: '5px', background: '#0d1117', color: '#00ff00', cursor: 'grab', fontWeight: 'bold' }}
      >
        &gt;_ Terminal Node
      </div>

      <div 
        onDragStart={(event) => onDragStart(event, 'ai_analyzer')} 
        draggable 
        style={{ padding: '10px', border: '1px solid #58a6ff', borderRadius: '5px', background: '#0d1117', color: '#58a6ff', cursor: 'grab', fontWeight: 'bold' }}
      >
        🧠 AI Analyzer Node
      </div>
    </aside>
  );
}

export default Sidebar;
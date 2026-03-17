import React, { useState } from 'react';

type SidebarNodeType = 'terminal' | 'ai_analyzer' | 'click_trigger';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const onDragStart = (event: React.DragEvent, nodeType: SidebarNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ 
      width: isOpen ? '250px' : '20px', 
      background: '#161b22', 
      borderRight: '1px solid #30363d', 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '15px', 
      color: '#c9d1d9', 
      fontFamily: 'monospace',
      transition: 'width 0.3s ease-in-out',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, color: '#fff', display: isOpen ? 'block' : 'none' }}>
          &gt;_ Araç Kutusu
        </h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#58a6ff',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
      
      <p style={{ fontSize: '12px', color: '#8b949e', margin: 0, display: isOpen ? 'block' : 'none' }}>
        Düğümleri (Nodes) tutup sağdaki alana sürükle.
      </p>

      <div 
        onDragStart={(event) => onDragStart(event, 'terminal')} 
        draggable={isOpen}
        style={{ 
          padding: '10px', 
          border: '1px solid #00ff00', 
          borderRadius: '5px', 
          background: '#0d1117', 
          color: '#00ff00', 
          cursor: isOpen ? 'grab' : 'default',
          fontWeight: 'bold',
          display: isOpen ? 'block' : 'none',
          whiteSpace: 'nowrap'
        }}
      >
        &gt;_ Terminal Node
      </div>

      <div 
        onDragStart={(event) => onDragStart(event, 'ai_analyzer')} 
        draggable={isOpen}
        style={{ 
          padding: '10px', 
          border: '1px solid #58a6ff', 
          borderRadius: '5px', 
          background: '#0d1117', 
          color: '#58a6ff', 
          cursor: isOpen ? 'grab' : 'default',
          fontWeight: 'bold',
          display: isOpen ? 'block' : 'none',
          whiteSpace: 'nowrap'
        }}
      >
        🧠 AI Analyzer Node
      </div>

      <div
        onDragStart={(event) => onDragStart(event, 'click_trigger')}
        draggable={isOpen}
        style={{ 
          padding: '10px', 
          border: '1px solid #f4b74d', 
          borderRadius: '5px', 
          background: '#0d1117', 
          color: '#f4b74d', 
          cursor: isOpen ? 'grab' : 'default',
          fontWeight: 'bold',
          display: isOpen ? 'block' : 'none',
          whiteSpace: 'nowrap'
        }}
      >
        ▶ Click Trigger Node
      </div>

      {!isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: '10px'
        }}>
          <div style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '25px',
            color: '#8b949e',
            fontWeight: 'bold',
            letterSpacing: '2px',
            whiteSpace: 'nowrap'
          }}>
            NODES STORE
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
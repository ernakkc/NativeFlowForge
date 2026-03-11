import { Handle, Position, useReactFlow } from '@xyflow/react';
import useWorkflowStore from '../../store/workflow.store';

function AIAnalyzerNode({ id }: { id: string }) {
  const { removeNode } = useWorkflowStore();

  const handleDelete = () => {
    removeNode(id);
  };

  return (
    <div style={{
      background: '#0d1117',
      color: '#58a6ff',     
      border: '1px solid #58a6ff',
      borderRadius: '8px',
      padding: '10px',
      width: '280px',
      fontFamily: 'monospace',
      boxShadow: '0 4px 6px rgba(88, 166, 255, 0.2)'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#58a6ff' }} />
      
      <div style={{ borderBottom: '1px solid #58a6ff', paddingBottom: '5px', marginBottom: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🧠 AI Analyzer</span>
        <button
          onClick={handleDelete}
          style={{
            background: '#ff0000',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          ✕
        </button>
      </div>
      
      <div>
        <textarea 
          placeholder="Analiz etmek istediğin metni gir..." 
          style={{ 
            width: '90%', 
            height: '80px',
            background: '#161b22', 
            color: '#58a6ff', 
            border: '1px solid #58a6ff', 
            borderRadius: '4px',
            padding: '5px',
            outline: 'none',
            fontFamily: 'monospace',
            fontSize: '12px',
            resize: 'none'
          }} 
        />
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#58a6ff' }} />
    </div>
  );
}

export default AIAnalyzerNode;

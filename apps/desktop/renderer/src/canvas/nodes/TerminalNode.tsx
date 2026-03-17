import { Handle, Position, type NodeProps } from '@xyflow/react';
import useWorkflowStore from '../../store/workflow.store';

function TerminalNode({ id, data }: NodeProps) {
  const { removeNode, updateNodeData } = useWorkflowStore();
  const lastOutput = typeof data?.lastOutput === 'string' ? data.lastOutput : '';
  const lastError = typeof data?.lastError === 'string' ? data.lastError : '';

  const handleDelete = () => {
    removeNode(id);
  };
  return (
    <div style={{
      background: '#0d1117',
      color: '#00ff00',     
      border: '1px solid #30363d',
      borderRadius: '8px',
      padding: '10px',
      width: '280px',
      fontFamily: 'monospace',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      
      <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '5px', marginBottom: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>&gt;_ Terminal Node</span>
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
        <input 
          type="text"
          value={(data?.command as string) ?? ''}
          placeholder="Komut gir (örn: ls -la)"
          onChange={(e) => updateNodeData(id, { command: e.target.value })}
          style={{ 
            width: '90%', 
            background: '#161b22', 
            color: '#c9d1d9', 
            border: '1px solid #30363d', 
            borderRadius: '4px',
            padding: '5px',
            outline: 'none'
          }} 
        />
      </div>

      <div
        style={{
          marginTop: '10px',
          border: '1px solid #30363d',
          borderRadius: '4px',
          background: '#0b0f14',
          padding: '6px',
          minHeight: '44px',
          fontSize: '11px',
          color: lastError ? '#ff7b72' : '#8b949e',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {lastError || lastOutput || 'Output burada gorunecek'}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
}

export default TerminalNode;
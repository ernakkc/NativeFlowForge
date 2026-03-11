import { Handle, Position, type NodeProps } from '@xyflow/react';
import useWorkflowStore from '../../store/workflow.store';

function TerminalNode({ id, data }: NodeProps) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

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
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '5px', marginBottom: '10px', fontWeight: 'bold' }}>
        {'>_ Terminal Node'}
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

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
}

export default TerminalNode;
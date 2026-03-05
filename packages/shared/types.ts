// ==========================================
// 1. ÇEKİRDEK VERİ MODELLERİ (WORKFLOW)
// ==========================================

// İleride eklenebilecek node türleri (terminal ve ilerideki AI/Http planları için)
export type NodeType = 'terminal' | 'http' | 'ai_analyzer' | 'ai_planner' | 'ai_runner';

// React Flow ile %100 uyumlu ama ona bağımlı olmayan Node yapımız
export interface NFFNode<TData = Record<string, any>> {
  id: string;
  type: NodeType | string;
  data: TData; // Node'un konfigürasyonu (Örn: { command: "ls -la" })
  position?: { x: number; y: number }; // UI için gerekli, Engine için opsiyonel
}

// Node'ları birbirine bağlayan kenarlar (Edges)
export interface NFFEdge {
  id: string;
  source: string; // Çıktıyı veren node ID'si
  target: string; // Girdiyi alan node ID'si
  sourceHandle?: string; // İleride birden fazla input/output portu olursa
  targetHandle?: string;
}

// Tüm sistemin kaydedip okuyacağı ana JSON yapısı
export interface WorkflowDocument {
  id: string;
  name: string;
  description?: string;
  nodes: NFFNode[];
  edges: NFFEdge[];
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// 2. ÇALIŞTIRMA (EXECUTION) VE STATE MODELLERİ
// ==========================================

export enum NodeExecutionState {
  IDLE = 'idle',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}

// Her bir node'un çalıştıktan sonra ürettiği sonuç
export interface ExecutionResult<T = any> {
  nodeId: string;
  state: NodeExecutionState;
  data?: T; // Başarılıysa dönen veri (stdout, json response vs.)
  error?: string; // Hata varsa (stderr, timeout vs.)
  startTime: number;
  endTime: number;
}

// Frontend ve Backend arasında akacak olan anlık loglar
export interface ExecutionEvent {
  workflowId: string;
  nodeId: string;
  type: 'STARTED' | 'COMPLETED' | 'FAILED' | 'LOG';
  payload?: any;
}

// ==========================================
// 3. EKLENTİ (PLUGIN) SİSTEMİ ARAYÜZLERİ
// ==========================================

// Bir node çalışırken, kendinden önceki node'ların ürettiği verileri bu formatta alacak
// Örn: { "node_1": { stdout: "..." }, "node_2": { json: {...} } }
export type NodeInputs = Record<string, any>;

// Senin yazacağın her yeni araç (Terminal, HTTP vs.) bu arayüze uymak ZORUNDA olacak
export interface INodePlugin {
  type: NodeType | string;
  name: string;
  description: string;
  
  // Asıl işi yapan fonksiyon
  execute(
    data: any, // Node'un kendi ayarları (command: 'ls')
    inputs: NodeInputs // Önceki node'lardan gelen veriler
  ): Promise<any>;
}
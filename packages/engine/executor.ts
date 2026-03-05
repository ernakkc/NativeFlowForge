export class WorkflowExecutor {
  private context: Record<string, any> = {}; // Node ID'lerine göre çıktıları saklar

  async execute(workflowJson: any) {
    const order = resolveExecutionOrder(workflowJson.nodes, workflowJson.edges);
    
    for (const nodeId of order) {
      const nodeDef = workflowJson.nodes.find(n => n.id === nodeId);
      const nodeInstance = NodeRegistry.get(nodeDef.type); // Örn: TerminalNode
      
      // Önceki node'ların çıktılarını topla ve bu node'a girdi olarak ver
      const inputs = this.gatherInputs(nodeId, workflowJson.edges);
      
      try {
         // Node'u çalıştır ve sonucunu context'e kaydet
         const result = await nodeInstance.execute(nodeDef.config, inputs);
         this.context[nodeId] = result;
         
         // UI'a "Bu node başarıyla çalıştı" bilgisini gönder (IPC üzerinden)
      } catch (error) {
         // Hata fırlat ve workflow'u durdur
      }
    }
  }
}
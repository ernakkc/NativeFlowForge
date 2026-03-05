// Gelen React Flow JSON verisinden sadece bağlantıları (edges) okuyup
// bağımlılık grafiğini çıkarır ve çalıştırılacak node'ların sırasını belirler.
export function resolveExecutionOrder(nodes: any[], edges: any[]): string[] {
  // 1. Hangi node'a kimler bağlı (Adjacency List oluşturma)
  // 2. Gelen kenarı (in-degree) 0 olanları bul (İlk çalışacaklar)
  // 3. Topolojik sıralama ile bir dizi döndür: ['node_1', 'node_2', 'node_3']
}
export interface DashboardMetrics {
  totalOrders: number; // Quantidade total de pedidos
  totalRevenue: number; // Receita total
  avgOrderValue: number; // Valor médio por pedido
  ordersByPeriod?: OrdersByPeriod[]; // Opcional: pedidos agrupados por período
}

export interface OrdersByPeriod {
  count?: number; // Número de pedidos nesse período
  revenue?: number; // Receita total nesse período
  period?: string; // Pode ser uma data formatada (ex: '2025-02-24') ou um identificador de período (ex: 'semana', 'mês')
}

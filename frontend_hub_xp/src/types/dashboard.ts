export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  ordersByPeriod?: OrdersByPeriod[];
}

export interface OrdersByPeriod {
  count?: number;
  revenue?: number;
  period?: string;
}

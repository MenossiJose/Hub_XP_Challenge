export interface Order {
  id: string; // ID único do pedido
  date: Date; // Data do pedido
  productIds: string[]; // Lista de IDs dos produtos presentes no pedido
}

export interface OrderFormData {
  date: string;
  productIds: string[];
  [key: string]: unknown;
}

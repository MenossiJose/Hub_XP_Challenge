export interface Order {
  id: string;
  date: Date;
  productIds: string[];
}

export interface OrderFormData {
  date: string;
  productIds: string[];
  [key: string]: unknown;
}

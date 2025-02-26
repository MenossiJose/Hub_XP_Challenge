import axios from "axios";
import { Order } from "../types/order";
import { DashboardMetrics, OrdersByPeriod } from "../types/dashboard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>(`${API_URL}/orders`);
  return response.data;
};

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  try {
    const response = await axios.post<Order>(`${API_URL}/orders`, order);
    return response.data;
  } catch (error) {
    console.error("Detailed API error:", error.response?.data);
    console.error("Request that caused the error:", order);
    throw error;
  }
};

export const updateOrder = async (
  id: string,
  order: Partial<Order>
): Promise<Order> => {
  const response = await axios.patch<Order>(`${API_URL}/orders/${id}`, order);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/orders/${id}`);
};

export const getSalesMetrics = async (
  filters?: OrdersByPeriod
): Promise<DashboardMetrics> => {
  const response = await axios.get(`${API_URL}/dashboard`, { params: filters });
  return response.data;
};

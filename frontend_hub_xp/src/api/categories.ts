import axios from "axios";
import { Category } from "../types/category";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; //Exposto por ser tratar de um desafio

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${API_URL}/categories`);
  return response.data;
};

export const createCategory = async (
  category: Partial<Category>
): Promise<Category> => {
  const response = await axios.post<Category>(
    `${API_URL}/categories`,
    category
  );
  return response.data;
};

export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<Category> => {
  const response = await axios.patch<Category>(
    `${API_URL}/categories/${id}`,
    category
  );

  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/categories/${id}`);
};

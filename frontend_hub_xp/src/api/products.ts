import axios from "axios";
import { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; //Exposto por ser tratar de um desafio

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_URL}/products`);
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (
  product: Partial<Product>
): Promise<Product> => {
  const response = await axios.post<Product>(`${API_URL}/products`, product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: any
): Promise<Product> => {
  try {
    if (productData instanceof FormData) {
      console.log("FormData entries:");
      for (let pair of productData.entries()) {
        console.log(pair[0], pair[1]);
      }
    } else {
      console.log("Data being sent:", productData);
    }

    const response = await axios.patch(
      `${API_URL}/products/${id}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateProduct API call:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`);
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  image?: File;
  [key: string]: unknown;
}

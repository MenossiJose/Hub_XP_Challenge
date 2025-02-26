export interface Product {
  id: string; // ID único do produto (pode ser string ou ObjectId convertido para string)
  name: string; // Nome do produto
  description: string; // Descrição do produto
  price: number; // Preço do produto
  categoryIds: string[]; // Lista de IDs de categorias (relacionamento many-to-many)
  imageUrl: string; // URL da imagem armazenada no S3 (ou LocalStack)
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  image?: File;
  [key: string]: unknown;
}

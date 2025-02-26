export interface Category {
  id: string; // ID único da categoria
  name: string; // Nome da categoria
}

export interface CategoryFormValues {
  name: string;
  [key: string]: unknown;
}

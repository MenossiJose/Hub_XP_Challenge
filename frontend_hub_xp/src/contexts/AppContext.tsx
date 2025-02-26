import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { Order } from "../types/order";
import { DashboardMetrics, OrdersByPeriod } from "../types/dashboard";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getSalesMetrics,
} from "../api/orders";
import { uploadFile } from "../api/s3";

interface AppContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  dashboardMetrics: DashboardMetrics | null;

  // Loading states
  productsLoading: boolean;
  categoriesLoading: boolean;
  ordersLoading: boolean;
  metricsLoading: boolean;

  // Error states
  productsError: string | null;
  categoriesError: string | null;
  ordersError: string | null;
  metricsError: string | null;

  // Filter state
  ordersByPeriod: OrdersByPeriod;

  // Action methods for products
  fetchProducts: () => Promise<void>;
  addProduct: (productData: any) => Promise<Product>;
  editProduct: (id: string, productData: any) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;

  // Action methods for categories
  fetchCategories: () => Promise<void>;
  addCategory: (categoryData: any) => Promise<Category>;
  editCategory: (id: string, categoryData: any) => Promise<Category>;
  removeCategory: (id: string) => Promise<void>;

  // Action methods for orders
  fetchOrders: () => Promise<void>;
  addOrder: (orderData: any) => Promise<Order>;
  editOrder: (id: string, orderData: any) => Promise<Order>;
  removeOrder: (id: string) => Promise<void>;

  // Action methods for metrics
  fetchSalesMetrics: (filters?: OrdersByPeriod) => Promise<void>;
  updateOrdersByPeriod: (newFilters: OrdersByPeriod) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetrics | null>(null);

  // Loading states
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // Error states
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Filter state
  const [ordersByPeriod, setOrdersByPeriod] = useState<OrdersByPeriod>({});

  // Products methods
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await getProducts();
      // Mapeia os produtos para garantir que cada um tenha a propriedade "id"
      const mappedData = data.map((product: any) => ({
        ...product,
        id: product._id || product.id,
      }));
      setProducts(mappedData);
      setProductsError(null);
    } catch (err) {
      setProductsError("Falha ao carregar produtos");
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const addProduct = async (productData: any) => {
    try {
      let imageUrl = "";

      // If productData is FormData with image file
      if (productData instanceof FormData && productData.get("image")) {
        const imageFile = productData.get("image") as File;
        imageUrl = await uploadFile(imageFile);

        // Remove image file from FormData and add the URL
        productData.delete("image");
        productData.append("imageUrl", imageUrl);

        // If categoryIds is a JSON string, parse it
        if (productData.get("categoryIds")) {
          const categoriesString = productData.get("categoryIds") as string;
          try {
            const categories = JSON.parse(categoriesString);
            productData.delete("categoryIds");
            categories.forEach((catId: string) => {
              productData.append("categoryIds[]", catId);
            });
          } catch (e) {
            console.error("Error parsing categoryIds", e);
          }
        }
      }

      const newProduct = await createProduct(productData);

      // Mapeia o novo produto para incluir "id"
      const mappedProduct = {
        ...newProduct,
        id: newProduct._id || newProduct.id,
      };
      setProducts((current) => [...current, mappedProduct]);
      return mappedProduct;
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    }
  };

  const editProduct = async (id: string, productData: FormData) => {
    try {
      // Create a new object to store all data
      const productToUpdate = {};

      // Extract all form data into an object
      for (let [key, value] of productData.entries()) {
        if (key === "categoryIds") {
          try {
            // Parse and store the categoryIds
            productToUpdate[key] = JSON.parse(value as string);
          } catch (e) {
            // Fallback: store as is
            productToUpdate[key] = value;
          }
        } else {
          productToUpdate[key] = value;
        }
      }

      // Handle image if present
      if (productData.get("image")) {
        const imageFile = productData.get("image") as File;
        const imageUrl = await uploadFile(imageFile);
        productToUpdate["imageUrl"] = imageUrl;
        delete productToUpdate["image"];
      }

      console.log("Sending to API:", productToUpdate);

      const updatedProduct = await updateProduct(id, productToUpdate);

      // Ensure the updated product has "id"
      const mappedProduct = {
        ...updatedProduct,
        id: updatedProduct._id || updatedProduct.id,
      };

      setProducts((current) =>
        current.map((product) => (product.id === id ? mappedProduct : product))
      );

      return mappedProduct;
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  };

  // Categories methods
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await getCategories();
      const mappedData = data.map((cat: any) => ({
        ...cat,
        id: cat._id || cat.id,
      }));
      setCategories(mappedData);
      setCategoriesError(null);
    } catch (err) {
      setCategoriesError("Falha ao carregar categorias");
      console.error("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const addCategory = async (categoryData: any) => {
    try {
      const newCategory = await createCategory(categoryData);
      const mappedCategory = {
        ...newCategory,
        id: newCategory._id || newCategory.id,
      };
      setCategories((current) => [...current, mappedCategory]);
      return mappedCategory;
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  };

  const editCategory = async (id: string, categoryData: any) => {
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      const mappedCategory = {
        ...updatedCategory,
        id: updatedCategory._id || updatedCategory.id,
      };
      setCategories((current) =>
        current.map((category) =>
          category.id === id ? mappedCategory : category
        )
      );
      return mappedCategory;
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((current) =>
        current.filter((category) => category.id !== id)
      );
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  // Orders methods
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrders();
      const mappedData = data.map((order: any) => ({
        ...order,
        id: order._id || order.id,
      }));
      setOrders(mappedData);
      setOrdersError(null);
    } catch (err) {
      setOrdersError("Falha ao carregar pedidos");
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    setOrdersLoading(true);
    try {
      const newOrder = await createOrder(orderData);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      return newOrder;
    } catch (error) {
      console.error("Error adding order:", error);
      setOrdersError(
        "Failed to add order: " +
          (error.response?.data?.message || error.message)
      );
      throw error;
    } finally {
      setOrdersLoading(false);
    }
  };

  const editOrder = async (id: string, orderData: any) => {
    try {
      const updatedOrder = await updateOrder(id, orderData);
      const mappedOrder = {
        ...updatedOrder,
        id: updatedOrder._id || updatedOrder.id,
      };
      setOrders((current) =>
        current.map((order) => (order.id === id ? mappedOrder : order))
      );
      return mappedOrder;
    } catch (err) {
      console.error("Error updating order:", err);
      throw err;
    }
  };

  const removeOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders((current) => current.filter((order) => order.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      throw err;
    }
  };

  // Metrics methods
  const fetchSalesMetrics = async (filters?: OrdersByPeriod) => {
    setMetricsLoading(true);
    try {
      const data = await getSalesMetrics(filters || ordersByPeriod);
      setDashboardMetrics(data);
      setMetricsError(null);
    } catch (err) {
      setMetricsError("Falha ao carregar métricas");
      console.error("Error fetching metrics:", err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const updateOrdersByPeriod = (newFilters: OrdersByPeriod) => {
    setOrdersByPeriod(newFilters);
  };

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchSalesMetrics(),
      ]);
    };

    loadInitialData();
  }, []);

  // Refetch metrics when filters change
  useEffect(() => {
    fetchSalesMetrics();
  }, [ordersByPeriod]);

  const contextValue: AppContextType = {
    // Data states
    products,
    categories,
    orders,
    dashboardMetrics,

    // Loading states
    productsLoading,
    categoriesLoading,
    ordersLoading,
    metricsLoading,

    // Error states
    productsError,
    categoriesError,
    ordersError,
    metricsError,

    // Filter state
    ordersByPeriod,

    // Methods
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,

    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,

    fetchOrders,
    addOrder,
    editOrder,
    removeOrder,

    fetchSalesMetrics,
    updateOrdersByPeriod,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

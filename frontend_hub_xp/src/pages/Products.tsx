import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppContext } from "../hooks/useAppContext";
import ProductTable from "../components/products/ProductTable";
import ProductForm from "../components/products/ProductForm";

const Products = () => {
  const {
    products,
    productsLoading,
    productsError,
    fetchProducts,
    fetchCategories,
    addProduct,
    editProduct,
    removeProduct,
  } = useAppContext();

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const initialFormValues = {
    name: "",
    description: "",
    price: 0,
    categoryIds: [],
    image: undefined,
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenForm = () => {
    setOpenForm(true);
    setEditMode(false);
    setCurrentProduct(null);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p._id === id || p.id === id);
    if (product) {
      setCurrentProduct(product);
      setEditMode(true);
      setOpenForm(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeProduct(id);
      setNotification({
        open: true,
        message: "Produto removido com sucesso!",
        type: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Erro ao remover produto.",
        type: "error",
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editMode && currentProduct) {
        await editProduct(currentProduct._id || currentProduct.id, values);
        setNotification({
          open: true,
          message: "Produto atualizado com sucesso!",
          type: "success",
        });
      } else {
        await addProduct(values);
        setNotification({
          open: true,
          message: "Produto adicionado com sucesso!",
          type: "success",
        });
      }
      handleCloseForm();
    } catch (err) {
      setNotification({
        open: true,
        message: "Erro ao salvar produto.",
        type: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  let formValues = initialFormValues;
  if (editMode && currentProduct) {
    formValues = {
      name: currentProduct.name,
      description: currentProduct.description,
      price: currentProduct.price,
      categoryIds: Array.isArray(currentProduct.categoryIds)
        ? currentProduct.categoryIds.map((cat) =>
            typeof cat === "object" ? cat._id || cat.id : cat
          )
        : [],
      image: undefined,
    };
  }

  // Loading state
  if (productsLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Produtos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Adicionar Produto
        </Button>
      </Box>

      {productsError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {productsError}
        </Alert>
      )}

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Editar Produto" : "Adicionar Produto"}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            initialValues={formValues}
            onSubmit={handleSubmit}
            isEdit={editMode}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert severity={notification.type}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;

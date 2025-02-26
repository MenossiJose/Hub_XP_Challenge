// src/pages/Categories.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import Table from "../components/common/Table";
import GenericForm from "../components/common/Form";
import { useAppContext } from "../hooks/useAppContext";
import { Category } from "../types/category";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
});

const Categories: React.FC = () => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    addCategory,
    editCategory,
    removeCategory,
  } = useAppContext();

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const initialFormValues = {
    name: "",
  };

  useEffect(() => {}, []);

  const handleOpenForm = () => {
    setOpenForm(true);
    setEditMode(false);
    setCurrentCategory(null);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setCurrentCategory(category);
      setEditMode(true);
      setOpenForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
      showNotification("Categoria removida com sucesso!", "success");
    } catch (err) {
      showNotification("Erro ao remover categoria.", "error");
      console.error(err);
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (editMode && currentCategory) {
        await editCategory(currentCategory.id, values);
        showNotification("Categoria atualizada com sucesso!", "success");
      } else {
        await addCategory(values);
        showNotification("Categoria adicionada com sucesso!", "success");
      }
      handleCloseForm();
    } catch (err) {
      showNotification("Erro ao salvar categoria.", "error");
      console.error(err);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const columns = [{ id: "name", label: "Nome" }];

  if (categoriesLoading) {
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
          Categorias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Adicionar Categoria
        </Button>
      </Box>

      {categoriesError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {categoriesError}
        </Alert>
      )}

      <Table
        columns={columns}
        data={categories}
        title="Listagem de Categorias"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? "Editar Categoria" : "Adicionar Categoria"}
        </DialogTitle>
        <DialogContent>
          <GenericForm
            initialValues={
              editMode && currentCategory
                ? { name: currentCategory.name }
                : initialFormValues
            }
            fields={[
              {
                name: "name",
                label: "Nome da Categoria",
                component: <TextField fullWidth />,
              },
            ]}
            validationSchema={CategorySchema}
            onSubmit={handleSubmit}
            title=""
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

export default Categories;

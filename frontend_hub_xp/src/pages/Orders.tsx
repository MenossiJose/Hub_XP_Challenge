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
import OrderTable from "../components/orders/OrderTable";
import OrderForm from "../components/orders/OrderForms";

const Orders = () => {
  const {
    orders,
    ordersLoading,
    ordersError,
    fetchOrders,
    fetchProducts,
    addOrder,
    editOrder,
    removeOrder,
  } = useAppContext();

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const initialFormValues = {
    date: new Date().toISOString().split("T")[0],
    productIds: [],
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleOpenForm = () => {
    setOpenForm(true);
    setEditMode(false);
    setCurrentOrder(null);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleEdit = (id) => {
    const order = orders.find((o) => o._id === id || o.id === id);
    if (order) {
      setCurrentOrder(order);
      setEditMode(true);
      setOpenForm(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeOrder(id);
      setNotification({
        open: true,
        message: "Pedido removido com sucesso!",
        type: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Erro ao remover pedido.",
        type: "error",
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Submitting order with data:", values);
      if (editMode && currentOrder) {
        await editOrder(currentOrder._id || currentOrder.id, values);
        setNotification({
          open: true,
          message: "Pedido atualizado com sucesso!",
          type: "success",
        });
      } else {
        await addOrder(values);
        setNotification({
          open: true,
          message: "Pedido adicionado com sucesso!",
          type: "success",
        });
      }
      handleCloseForm();
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
      setNotification({
        open: true,
        message: `Erro ao salvar pedido: ${
          err.response?.data?.message || err.message
        }`,
        type: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  let formValues = initialFormValues;
  if (editMode && currentOrder) {
    formValues = {
      date: new Date(currentOrder.date).toISOString().split("T")[0],
      productIds: Array.isArray(currentOrder.productIds)
        ? currentOrder.productIds.map((prod) =>
            typeof prod === "object" ? prod._id || prod.id : prod
          )
        : [],
    };
  }

  if (ordersLoading) {
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
          Pedidos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Adicionar Pedido
        </Button>
      </Box>

      {ordersError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {ordersError}
        </Alert>
      )}

      <OrderTable orders={orders} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Editar Pedido" : "Adicionar Pedido"}
        </DialogTitle>
        <DialogContent>
          <OrderForm
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

export default Orders;

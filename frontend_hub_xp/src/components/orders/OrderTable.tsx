import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface OrderTableProps {
  orders: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders = [],
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderTotal = (products: any[]) => {
    if (!Array.isArray(products)) return 0;

    return products.reduce((total, product) => {
      const price =
        typeof product === "object" && product.price
          ? Number(product.price)
          : 0;
      return total + price;
    }, 0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Produtos</TableCell>
            <TableCell>Valor Total</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id || order.id}>
              <TableCell>{order._id || order.id}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>
                {Array.isArray(order.productIds)
                  ? order.productIds
                      .map((prod: any) =>
                        typeof prod === "object" && prod.name
                          ? prod.name
                          : String(prod)
                      )
                      .join(", ")
                  : ""}
              </TableCell>
              <TableCell>
                R$ {calculateOrderTotal(order.productIds).toFixed(2)}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => onEdit && onEdit(order._id || order.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete && onDelete(order._id || order.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;

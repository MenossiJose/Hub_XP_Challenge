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
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ProductTableProps {
  products: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products = [],
  onEdit,
  onDelete,
}) => {
  // Super simplified table without any complex processing
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Categorias</TableCell>
            <TableCell>Imagem</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id || product.id}>
              <TableCell>{product._id || product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>R$ {Number(product.price).toFixed(2)}</TableCell>
              <TableCell>
                {Array.isArray(product.categoryIds)
                  ? product.categoryIds
                      .map((cat: any) =>
                        typeof cat === "object" && cat.name
                          ? cat.name
                          : String(cat)
                      )
                      .join(", ")
                  : ""}
              </TableCell>
              <TableCell>
                {product.imageUrl ? (
                  <Avatar
                    src={product.imageUrl}
                    alt={product.name}
                    sx={{ width: 50, height: 50 }}
                  />
                ) : (
                  "No image"
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => onEdit && onEdit(product._id || product.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() =>
                    onDelete && onDelete(product._id || product.id)
                  }
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

export default ProductTable;

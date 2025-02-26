import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Column {
  id: string;
  label: string;
  format?: (value: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  title: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  title,
  onEdit,
  onDelete,
}) => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
      <Box p={2}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align="left">
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align="right">Ações</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow hover key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left">
                    {column.format
                      ? column.format(row[column.id])
                      : row[column.id]}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell align="right">
                    {onEdit && (
                      <IconButton onClick={() => onEdit(row.id)} size="small">
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        onClick={() => onDelete(row.id)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
};

export default Table;

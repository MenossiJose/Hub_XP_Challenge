import React from "react";
import Table, { Column } from "../common/Table";
import { Category } from "../../types/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  const columns: Column[] = [
    { id: "id", label: "ID" },
    { id: "name", label: "Nome" },
  ];

  return (
    <Table
      title="Categorias"
      columns={columns}
      data={categories}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default CategoryTable;

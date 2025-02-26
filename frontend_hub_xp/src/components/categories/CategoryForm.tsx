import React from "react";
import GenericForm from "../common/Form";
import { TextField } from "@mui/material";
import * as Yup from "yup";
import { CategoryFormValues } from "../../types/category";

interface CategoryFormProps {
  initialValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  isEdit?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("O nome da categoria é obrigatório"),
});

const fields = [
  {
    name: "name",
    label: "Nome da Categoria",
    component: <TextField fullWidth />,
  },
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues = { name: "" },
  onSubmit,
  isEdit = false,
}) => {
  return (
    <GenericForm<CategoryFormValues>
      initialValues={initialValues}
      fields={fields}
      title={isEdit ? "Editar Categoria" : "Criar Categoria"}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      isEdit={isEdit}
    />
  );
};

export default CategoryForm;

import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  Chip,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  Stack,
  FormHelperText,
} from "@mui/material";
import { ProductFormData } from "../../types/product";
import * as Yup from "yup";
import { useAppContext } from "../../hooks/useAppContext";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface ProductFormProps {
  initialValues?: ProductFormData;
  onSubmit: (values: FormData) => void;
  isEdit?: boolean;
}

const getValidationSchema = (isEdit: boolean) =>
  Yup.object({
    name: Yup.string().required("O nome do produto é obrigatório"),
    description: Yup.string().required("A descrição do produto é obrigatória"),
    price: Yup.number().required("O preço do produto é obrigatório"),
    categoryIds: Yup.array().min(1, "Pelo menos uma categoria é obrigatória"),
    image: isEdit
      ? Yup.mixed()
      : Yup.mixed().required("A imagem do produto é obrigatória"),
  });

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues = {
    name: "",
    description: "",
    price: 0,
    categoryIds: [],
    image: undefined,
  },
  onSubmit,
  isEdit = false,
}) => {
  const { categories } = useAppContext();

  // Pre-process initial values to ensure categoryIds is always an array
  const processedValues = {
    ...initialValues,
    categoryIds: Array.isArray(initialValues.categoryIds)
      ? initialValues.categoryIds.map((cat: any) =>
          typeof cat === "object" ? cat._id || cat.id : cat
        )
      : [],
  };

  const handleSubmitForm = (values: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());

    // Ensure categoryIds is always an array before mapping
    const categoryIds = Array.isArray(values.categoryIds)
      ? values.categoryIds.map((cat: any) =>
          typeof cat === "object" ? cat._id || cat.id : cat
        )
      : [];

    formData.append("categoryIds", JSON.stringify(categoryIds));
    if (values.image) {
      formData.append("image", values.image);
    }

    onSubmit(formData);
  };

  return (
    <Formik
      initialValues={processedValues}
      validationSchema={getValidationSchema(isEdit)}
      onSubmit={handleSubmitForm}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <Form>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="name"
              label="Nome do Produto"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              fullWidth
              name="description"
              label="Descrição do Produto"
              multiline
              rows={4}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            <TextField
              fullWidth
              name="price"
              label="Preço do Produto"
              type="number"
              inputProps={{ step: "0.01" }}
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && Boolean(errors.price)}
              helperText={touched.price && errors.price}
            />

            <FormControl
              fullWidth
              error={touched.categoryIds && Boolean(errors.categoryIds)}
            >
              <InputLabel>Categorias</InputLabel>
              <Select
                multiple
                name="categoryIds"
                value={
                  Array.isArray(values.categoryIds) ? values.categoryIds : []
                }
                onChange={handleChange}
                onBlur={handleBlur}
                input={<OutlinedInput label="Categorias" />}
                renderValue={(selected) => {
                  // Ensure selected is always an array
                  const selectedArray = Array.isArray(selected) ? selected : [];

                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selectedArray.length > 0 ? (
                        selectedArray.map((value: any) => {
                          const catId =
                            typeof value === "object"
                              ? value._id || value.id
                              : value;

                          const category = categories.find(
                            (c) => (c._id || c.id) === catId
                          );
                          const catName = category
                            ? category.name
                            : String(catId);

                          return <Chip key={catId} label={catName} />;
                        })
                      ) : (
                        <span>Selecione categorias</span>
                      )}
                    </Box>
                  );
                }}
              >
                {categories.map((category) => {
                  const catId = category._id || category.id;
                  return (
                    <MenuItem key={catId} value={catId}>
                      {category.name}
                    </MenuItem>
                  );
                })}
              </Select>
              {touched.categoryIds && errors.categoryIds && (
                <FormHelperText>{errors.categoryIds as string}</FormHelperText>
              )}
            </FormControl>

            <Box>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setFieldValue("image", file);
                }}
              />
              {touched.image && errors.image && (
                <FormHelperText error>{errors.image as string}</FormHelperText>
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" color="primary">
                {isEdit ? "Atualizar Produto" : "Criar Produto"}
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;

import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { OrderFormData } from "../../types/order";
import * as Yup from "yup";
import { useAppContext } from "../../hooks/useAppContext";
import { Formik, Form } from "formik";

interface OrderFormProps {
  initialValues?: OrderFormData;
  onSubmit: (values: OrderFormData) => void;
  isEdit?: boolean;
  products?: any[]; // Add products prop if not using context
}

const getValidationSchema = () =>
  Yup.object({
    date: Yup.string().required("A data do pedido é obrigatória"),
    productIds: Yup.array().min(1, "Pelo menos um produto é obrigatório"),
  });

const OrderForm: React.FC<OrderFormProps> = ({
  initialValues = {
    date: new Date().toISOString().split("T")[0],
    productIds: [],
  },
  onSubmit,
  isEdit = false,
}) => {
  const { products } = useAppContext();

  // Pre-process initial values to ensure productIds is always an array
  const processedValues = {
    ...initialValues,
    productIds: Array.isArray(initialValues.productIds)
      ? initialValues.productIds.map((prod: any) =>
          typeof prod === "object" ? prod._id || prod.id : prod
        )
      : [],
  };

  const handleSubmitForm = (values: OrderFormData) => {
    // Get selected products to calculate total
    const selectedProductIds = Array.isArray(values.productIds)
      ? values.productIds
      : [];

    // Calculate total price from selected products
    let total = 0;
    selectedProductIds.forEach((productId) => {
      const product = products.find((p) => (p._id || p.id) === productId);
      if (product) {
        total += Number(product.price);
      }
    });

    // Format date as YYYY-MM-DD only
    const dateString = values.date.split("T")[0];

    const formattedValues = {
      date: dateString,
      productIds: selectedProductIds,
      total: total, // Add the required total field
    };
    onSubmit(formattedValues);
  };
  return (
    <Formik
      initialValues={processedValues}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmitForm}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Form>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="date"
              label="Data do Pedido"
              type="date"
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.date && Boolean(errors.date)}
              helperText={touched.date && errors.date}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl
              fullWidth
              error={touched.productIds && Boolean(errors.productIds)}
            >
              <InputLabel>Produtos</InputLabel>
              <Select
                multiple
                name="productIds"
                value={
                  Array.isArray(values.productIds) ? values.productIds : []
                }
                onChange={handleChange}
                onBlur={handleBlur}
                input={<OutlinedInput label="Produtos" />}
                renderValue={(selected) => {
                  // Ensure selected is always an array
                  const selectedArray = Array.isArray(selected) ? selected : [];

                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selectedArray.length > 0 ? (
                        selectedArray.map((value: any) => {
                          const prodId =
                            typeof value === "object"
                              ? value._id || value.id
                              : value;

                          const product = products.find(
                            (p) => (p._id || p.id) === prodId
                          );
                          const prodName = product
                            ? product.name
                            : String(prodId);

                          return <Chip key={prodId} label={prodName} />;
                        })
                      ) : (
                        <span>Selecione produtos</span>
                      )}
                    </Box>
                  );
                }}
              >
                {products.map((product) => {
                  const prodId = product._id || product.id;
                  return (
                    <MenuItem key={prodId} value={prodId}>
                      {product.name} - R$ {Number(product.price).toFixed(2)}
                    </MenuItem>
                  );
                })}
              </Select>
              {touched.productIds && errors.productIds && (
                <FormHelperText>{errors.productIds as string}</FormHelperText>
              )}
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" color="primary">
                {isEdit ? "Atualizar Pedido" : "Criar Pedido"}
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default OrderForm;

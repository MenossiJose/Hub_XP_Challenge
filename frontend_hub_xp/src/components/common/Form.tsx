import React from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Formik, Form as FormikForm, FormikProps } from "formik";
import * as Yup from "yup";

interface FormFieldConfig {
  name: string;
  label: string;
  type?: string;
  component: React.ReactElement<{
    name: string;
    label: string;
    value: unknown;
    onChange: (e: React.ChangeEvent<unknown>) => void;
    onBlur: (e: React.FocusEvent<unknown>) => void;
    error?: boolean;
    helperText?: string | false;
  }>;
  validation?: unknown;
}

interface FormProps<T extends Record<string, unknown>> {
  initialValues: T;
  fields:
    | FormFieldConfig[]
    | ((
        setFieldValue: (field: string, value: any) => void
      ) => FormFieldConfig[]);
  title: string;
  onSubmit: (values: T) => void;

  validationSchema?: Yup.ObjectSchema<any>;
  isEdit?: boolean;
}

function GenericForm<T extends Record<string, unknown>>({
  initialValues,
  fields,
  title,
  onSubmit,
  validationSchema,
  isEdit = false,
}: FormProps<T>) {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
          setSubmitting(false);
          if (!isEdit) resetForm();
        }}
      >
        {(formikProps: FormikProps<T>) => {
          const fieldsArray =
            typeof fields === "function"
              ? fields(formikProps.setFieldValue)
              : fields;

          return (
            <FormikForm>
              <Grid container spacing={3}>
                {fieldsArray.map((field) => (
                  <Grid item xs={12} key={field.name}>
                    {React.cloneElement(field.component, {
                      name: field.name,
                      label: field.label,
                      value: formikProps.values[field.name],
                      onChange: formikProps.handleChange,
                      onBlur: formikProps.handleBlur,
                      error:
                        formikProps.touched[field.name] &&
                        Boolean(formikProps.errors[field.name]),
                      helperText:
                        formikProps.touched[field.name] &&
                        (formikProps.errors[field.name] as string | undefined),
                    })}
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={formikProps.isSubmitting}
                    >
                      {isEdit ? "Atualizar" : "Salvar"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </FormikForm>
          );
        }}
      </Formik>
    </Paper>
  );
}

export default GenericForm;

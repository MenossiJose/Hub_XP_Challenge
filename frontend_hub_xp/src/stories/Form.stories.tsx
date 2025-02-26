import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import GenericForm from "../components/common/Form"; // ajuste o caminho conforme necessário
import * as Yup from "yup";

const meta: Meta<typeof GenericForm> = {
  title: "Components/Form",
  component: GenericForm,
};

export default meta;

type Story = StoryObj<typeof GenericForm>;

const initialValues = {
  name: "",
  email: "",
};

const fields = [
  {
    name: "name",
    label: "Nome",
    component: <input />,
  },
  {
    name: "email",
    label: "Email",
    component: <input />,
  },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
});

export const Default: Story = {
  args: {
    title: "Formulário de Exemplo",
    initialValues,
    fields,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validationSchema,
    isEdit: false,
  },
};

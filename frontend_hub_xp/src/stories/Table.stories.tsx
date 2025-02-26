// src/stories/Table.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Table, { Column } from "../components/common/Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

const columns: Column[] = [
  { id: "id", label: "ID" },
  { id: "name", label: "Nome" },
  {
    id: "price",
    label: "Preço",
    format: (value: number) => `R$ ${value.toFixed(2)}`,
  },
];

const data = [
  { id: "1", name: "Produto A", price: 29.99 },
  { id: "2", name: "Produto B", price: 49.99 },
  { id: "3", name: "Produto C", price: 19.99 },
];

export const Default: Story = {
  args: {
    title: "Exemplo de Tabela",
    columns,
    data,
    onEdit: (id: string) => alert(`Editar item ${id}`),
    onDelete: (id: string) => alert(`Deletar item ${id}`),
  },
};

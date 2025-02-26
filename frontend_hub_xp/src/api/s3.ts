import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; //Exposto por ser tratar de um desafio

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{ url: string }>(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.url;
};

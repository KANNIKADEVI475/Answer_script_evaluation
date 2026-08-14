import api from "./api";

export const getEvaluation = async (id) => {
  const response = await api.get(`/history/${id}`);

  return response.data;
};

import api from "./api";

export const getStudentResult = async (data) => {
  const response = await api.post("/student/result", data);

  return response.data;
};

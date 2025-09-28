import apiClient from "./apiClient";

const ANTI_PRO_BASE_PATH = "/antiprocrastinacion/urls/";

export const getAntiPros = async () => {
  const response = await apiClient.get(ANTI_PRO_BASE_PATH);
  return response.data;
};

export const createAntiPro = async (data) => {
  const response = await apiClient.post(ANTI_PRO_BASE_PATH, data);
  return response.data;
};

export const deleteAntiPro = async (id) => {
  const response = await apiClient.delete(`${ANTI_PRO_BASE_PATH}${id}/`);
  return response.data;
};

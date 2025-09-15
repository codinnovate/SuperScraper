import apiClient from "./api-client";

export const getAllStylistsApi = async (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const response = await apiClient.get("/browse/stylists", {
    params,
  });
  return response.data;
};

export const getFilteredStylistsApi = async (
  params: PaginationParams = { page: 1, limit: 10 },
  filter: Record<string, any> = {}
) => {
  const response = await apiClient.get("/browse/stylists/filter", {
    params: { ...params, ...filter },
  });

  return response.data;
}

export const getAllStylesApi = async (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const response = await apiClient.get("/browse/styles/all", {
    params,
  });
  return response.data;
};

export const getFilteredStylesApi = async (
  params: PaginationParams = { page: 1, limit: 10 },
  filter: Record<string, any> = {}
) => {
  const response = await apiClient.get("/browse/styles/filter", {
    params: { ...params, ...filter },
  });
  return response.data;
};
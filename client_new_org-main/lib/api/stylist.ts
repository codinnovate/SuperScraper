import { OrderStatus } from "@/types/stylist.types";
import apiClient from "./api-client";

export const getStylistStylesApi = async (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const response = await apiClient.get("/stylist/styles", {
    params,
  });
  return response.data;
};

export const createStyleApi = async (payload: FormData) => {
  const response = await apiClient.post("/stylist/styles", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateStyleApi = async (styleId: string, payload: Record<string, any>) => {
  console.log('updateStyleApi called with styleId:', styleId);
  console.log('Making PUT request to:', `/stylist/styles/${styleId}`);
  console.log('Payload:', payload);
  
  try {
    const response = await apiClient.put(`/stylist/styles/${styleId}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log('Update API response:', response);
    return response.data;
  } catch (error) {
    console.error('Update API error:', error);
    throw error;
  }
};

export const deleteStyleApi = async (styleId: string) => {
  console.log('deleteStyleApi called with styleId:', styleId);
  console.log('Making DELETE request to:', `/stylist/styles/delete?id=${styleId}`);
  
  try {
    const response = await apiClient.delete(`/stylist/styles/delete?id=${styleId}`);
    console.log('Delete API response:', response);
    return response.data;
  } catch (error) {
    console.error('Delete API error:', error);
    throw error;
  }
};

export const createStylistProfileApi = async (payload: FormData) => {
  const response = await apiClient.post("/stylist/profile/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getStylistProfileApi = async () => {
  try {
    const response = await apiClient.get("/stylist/profile/");
    console.log('getStylistProfileApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('getStylistProfileApi error:', error);
    throw error;
  }
};

export const updateStylistProfileApi = async (payload: FormData | Record<string, any>) => {
  const isFormData = payload instanceof FormData;
  const headers = isFormData 
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };
    
  console.log('updateStylistProfileApi called with payload:', payload);
  console.log('Headers:', headers);
  
  try {
    const response = await apiClient.put("/stylist/profile/", payload, { headers });
    console.log('updateStylistProfileApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('updateStylistProfileApi error:', error);
    throw error;
  }
};

export const getStylistReviewsApi = async (
  stylistId: string,
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const response = await apiClient.get(`/stylists/${stylistId}/reviews`, {
    params,
  });
  return response.data;
};

export const getStylistOrdersApi = async (params: {
  status: OrderStatus.IN_PROGRESS;
}) => {
  const response = await apiClient.get("orders/all", {
    params,
  });
  return response.data;
};

export const getStylistCompletedOrdersApi = async (params: {
  status: OrderStatus.COMPLETED;
}) => {
  const response = await apiClient.get("orders/all", {
    params,
  });
  return response.data;
};

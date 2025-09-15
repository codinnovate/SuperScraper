import apiClient from "./api-client";

export const getCustomerBidsForStylistApi = async (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const response = await apiClient.get("/gigs/stylist", {
    params,
  });
  return response.data;
};

export const getStylistOffersApi = async (
  params: PaginationParams = { page: 1, limit: 100 }
) => {
  const response = await apiClient.get("/gigs/stylist/offers", {
    params,
  });
  return response.data;
};

export const getBidDetailsApi = async (bidId: string) => {
  const response = await apiClient.get(`/gigs/customer/${bidId}`);
  return response.data;
};

export const createBidByCustomerApi = async (
  data: FormData
) => {
  try {
    const response = await apiClient.post("/gigs/customer", data);
    return response.data;
  } catch (error) {
    console.error("createBidByCustomerApi error:", error);
    throw error;
  }
};

export const createOfferByStylistApi = async (
  bid_id: string,
  payload: {
    customer_id: string;
    style_id: string;
    price: number;
    delivery_date: string;
  }
) => {
  // Use the new endpoint provided by backend developer (without /api/v1/ prefix)
  const url = `/gigs/stylist/offers/${bid_id}`;
  console.log("API call - URL:", url);
  console.log("API call - Full URL:", `${process.env.EXPO_PUBLIC_API_URL}${url}`);
  console.log("API call - Payload:", payload);
  console.log("API call - Method: POST");
  
  try {
    const response = await apiClient.post(url, payload);
    console.log("API call - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API call - Error details:", error);
    console.error("API call - Error response:", error.response?.data);
    console.error("API call - Error status:", error.response?.status);
    throw error;
  }
};
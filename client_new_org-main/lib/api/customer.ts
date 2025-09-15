import { CustomerProfile, CustomerStylistProfile } from "@/types/customer.types";
import apiClient from "./api-client";

export const getCustomerFavoritesApi = async (
    params: PaginationParams = { page: 1, limit: 10 }
) => {
    const response = await apiClient.get("/customer/favorites", {
        params,
    });
    // console.log(response.data)
    return response.data;
}

export const addToFavoritesApi = async (style_id: string) => {
    const response = await apiClient.post('/customer/favorites', { style_id });
    return response.data;
}

export const removeFromFavoritesApi = async (style_id: string) => {
    const response = await apiClient.delete(`/customer/favorites/${style_id}`);
    return response.data;
}

export const getCustomerProfileApi = async (): Promise<CustomerProfile> => {
    const response = await apiClient.get("/customer");
    return response.data;
}

export const createCustomerProfileApi = async (
    payload: Record<string, number | string | number | boolean | Record<string, number>>
) => {
    const response = await apiClient.post("/customer/new", payload);
    return response.data;
}

export const updateCustomerProfileApi = async (
    payload: Record<string, number | string | number | boolean | Record<string, number>>
) => {
    const response = await apiClient.put("/customer/update", payload);
    return response.data;
}

export const getCustomerStylistProfileApi = async (id: string): Promise<CustomerStylistProfile> => {
    const response = await apiClient.get(`/browse/stylists/${id}`);
    return response.data;
}

export const getCustomerStylistStylesApi = async (id: string, params: PaginationParams = { page: 1, limit: 10 }) => {
    const response = await apiClient.get(`customer/stylist/${id}`, {
        params,
    });
    return response.data;
}

export const getMyStyles = async (params: PaginationParams = { page: 1, limit: 10 }) => {
    const response = await apiClient.get("/gigs/customer", {
        params,
    });
    return response.data;
}

export const getMyStylesOffers = async (id: string, params: PaginationParams = { page: 1, limit: 10 }) => {
    const response = await apiClient.get(`/gigs/customer/offers/${id}`, {
        params,
    });
    return response.data;
}
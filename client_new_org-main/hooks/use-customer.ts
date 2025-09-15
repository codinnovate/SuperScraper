import { addToFavoritesApi, createCustomerProfileApi, getCustomerFavoritesApi, getCustomerProfileApi, getCustomerStylistProfileApi, getCustomerStylistStylesApi, getMyStyles, getMyStylesOffers, removeFromFavoritesApi, updateCustomerProfileApi } from "@/lib/api/customer";
import { AxiosError } from "axios";
import { useState } from "react";
import useSWR from "swr";

export const useCustomerFavorites = (
  params: PaginationParams = { page: 1, limit: 10 },
  options: { revalidateOnFocus?: boolean } = {}
) => {
  const { revalidateOnFocus = false } = options;
  
  const { data, error, isLoading, mutate } = useSWR(
    [`customer-favorites`, params],
    () => getCustomerFavoritesApi(params),
    {
      revalidateOnMount: true,
      revalidateOnFocus,
      revalidateOnReconnect: false,
      dedupingInterval: 2000, // Prevent duplicate requests for 2 seconds
    }
  );

  return {
    favorites: data?.favorites || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
}

export const useToggleFavorite = () => {
    const addToFavorites = async (style_id: string) => {
        try {
            const response = await addToFavoritesApi(style_id);
            return { success: true, data: response };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to add to favorites";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "An unexpected error occurred" };
        }
    };

    const removeFromFavorites = async (style_id: string) => {
        try {
            const response = await removeFromFavoritesApi(style_id);
            return { success: true, data: response };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to remove from favorites";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "An unexpected error occurred" };
        }
    };

    return { addToFavorites, removeFromFavorites };
}

export const useCustomerProfile = (
    options: { revalidateOnFocus?: boolean } = {}
) => {
    const { revalidateOnFocus = true } = options; // Default to true for tab switching
    
    const { data, error, isLoading, mutate } = useSWR("customer-profile",
        getCustomerProfileApi,
        {
            revalidateOnMount: true,
            revalidateOnFocus,
            revalidateOnReconnect: false,
            dedupingInterval: 1000, // Allow more frequent updates for profile
        }
    );

    return {
        profile: data || null,
        error: error?.message || null,
        isLoading,
        mutate,
    }
}

export const useCreateOrUpdateCustomerProfile = () => {
    const [isLoading, setIsLoading] = useState(false);

    const createProfile = async (payload: Record<string, number | string | number | boolean | Record<string, number>>) => {
        try {
            setIsLoading(true);

            const response = await createCustomerProfileApi(payload);
            return { success: true, data: response };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to create profile";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "An unexpected error occurred" };
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (payload: Record<string, number | string | number | boolean | Record<string, number>>) => {
        try {
            setIsLoading(true);

            const response = await updateCustomerProfileApi(payload);
            return { success: true, data: response };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to update profile";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "An unexpected error occurred" };
        } finally {
            setIsLoading(false);
        }
    };

    return { createProfile, updateProfile, isLoading };
}

export const useCustomerStylistProfile = (id: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        id ? [`customer-stylist-profile`, id] : null,
        () => getCustomerStylistProfileApi(id),
    );

    return {
        stylistProfile: data || null,
        error: error?.message || null,
        isLoading,
        mutate,
    };
}

export const useCustomerStylistStyles = (id: string, params: PaginationParams = { page: 1, limit: 10 }) => {
    const { data, error, isLoading, mutate } = useSWR(
        id ? [`customer-stylist-styles`, id, params] : null,
        () => getCustomerStylistStylesApi(id, params),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 2000,
        }
    );

    return {
        styles: data?.styles || [],
        error: error?.message || null,
        isLoading,
        mutate,
    };
}

export const useMyStyles = (params: PaginationParams = { page: 1, limit: 10 }) => {
    const { data, error, isLoading, mutate } = useSWR(
        [`my-styles`, params],
        () => getMyStyles(params),
    );

    return {
        myStyles: data || [],
        error: error?.message || null,
        isLoading,
        mutate,
    };
}

export const useMyStylesOffers = (id: string, params: PaginationParams = { page: 1, limit: 10 }) => {
    const { data, error, isLoading, mutate } = useSWR(
        id ? [`my-styles-offers`, id, params] : null,
        () => getMyStylesOffers(id, params),
    );

    return {
        offers: data || [],
        error: error?.message || null,
        isLoading,
        mutate,
    };
}
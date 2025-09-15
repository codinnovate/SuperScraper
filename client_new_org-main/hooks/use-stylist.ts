import {
    createStyleApi,
    createStylistProfileApi,
    deleteStyleApi,
    getStylistCompletedOrdersApi,
    getStylistOrdersApi,
    getStylistProfileApi,
    getStylistReviewsApi,
    getStylistStylesApi,
    updateStyleApi,
    updateStylistProfileApi,
} from "@/lib/api/stylist";
import { OrderStatus } from "@/types/stylist.types";
import { AxiosError } from "axios";
import React, { useState } from "react";
import useSWR from "swr";

// Hook to get stylist styles
export const useStylistStyles = (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`stylist-styles`, params],
    () => getStylistStylesApi(params)
  );

  return {
    styles: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

// Hook to get stylist profile
export const useStylistProfile = () => {
  const { data, error, isLoading, mutate } = useSWR("stylist-profile", () =>
    getStylistProfileApi()
  );

  // Debug: Log profile data changes
  React.useEffect(() => {
    console.log('useStylistProfile: Profile data changed:', data);
    console.log('useStylistProfile: Profile delivery_days:', data?.delivery_days);
  }, [data]);

  return {
    profile: data || null,
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

/**
 * Hook to get stylist orders
 */
export const useStylistOrders = (params: {
  status: OrderStatus.IN_PROGRESS;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`stylist-orders`, params],
    () => getStylistOrdersApi(params)
  );

  return {
    orders: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

/**
 * Hook to get stylist completed orders
 */
export const useStylistCompletedOrders = (params: {
  status: OrderStatus.COMPLETED;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`stylist-orders`, params],
    () => getStylistCompletedOrdersApi(params)
  );

  return {
    orders: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

/**
 * Hook to create a stylist profile
 */
export const useCreateStylistProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useStylistProfile();

  const createStylistProfile = async (payload: FormData) => {
    try {
      setIsLoading(true);

      const response = await createStylistProfileApi(payload);

      await mutate();

      return { success: true, data: response };
    } catch (err) {
      if (err instanceof AxiosError) {
        const { response } = err;
        const errorMessage =
          response?.data?.error || "Failed to create stylist profile";
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createStylistProfile, isLoading };
};

// Hook to create a new style
export const useCreateStyle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useStylistStyles();

  const createStyle = async (payload: FormData) => {
    try {
      setIsLoading(true);

      const response = await createStyleApi(payload);

      await mutate();

      return { success: true, data: response };
    } catch (err) {
      if (err instanceof AxiosError) {
        const { response } = err;
        const errorMessage = response?.data?.error || "Failed to create style";
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createStyle, isLoading };
};

// Hook to delete a style (soft delete by setting is_available to false)
export const useDeleteStyle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useStylistStyles();

  const deleteStyle = async (styleId: string) => {
    try {
      setIsLoading(true);

      // Try soft delete first (set is_available to false)
      try {
        const response = await updateStyleApi(styleId, { is_available: false });
        await mutate();
        return { success: true, data: response };
      } catch (updateError) {
        console.log('Soft delete failed, trying hard delete:', updateError);
        
        // If soft delete fails, try hard delete as fallback
        const response = await deleteStyleApi(styleId);
        await mutate();
        return { success: true, data: response };
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const { response } = err;
        const errorMessage = response?.data?.error || "Failed to delete style";
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteStyle, isLoading };
};

// Hook to update stylist profile
export const useUpdateStylistProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useStylistProfile();

  const updateStylistProfile = async (payload: FormData | Record<string, any>) => {
    try {
      setIsLoading(true);

      console.log('useUpdateStylistProfile: Sending payload:', payload);
      const response = await updateStylistProfileApi(payload);
      console.log('useUpdateStylistProfile: API response:', response);

      // Invalidate and revalidate the cache
      await mutate(undefined, { revalidate: true });

      return { success: true, data: response };
    } catch (err) {
      console.error('useUpdateStylistProfile: Error:', err);
      if (err instanceof AxiosError) {
        const { response } = err;
        const errorMessage =
          response?.data?.error || "Failed to update profile";
        return { success: false, error: errorMessage };
      }
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStylistProfile, isLoading };
};

// Hook to get stylist reviews
export const useStylistReviews = (
  stylistId: string,
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`stylist-reviews`, stylistId, params],
    () => getStylistReviewsApi(stylistId, params)
  );

  return {
    reviews: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

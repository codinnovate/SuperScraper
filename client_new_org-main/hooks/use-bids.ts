import { createBidByCustomerApi, createOfferByStylistApi, getBidDetailsApi, getCustomerBidsForStylistApi } from "@/lib/api/bids";
import { AxiosError } from "axios";
import { useState } from "react";
import useSWR from "swr";

// Hook to get customer bids
export const useCustomerBidsForStylist = (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`customer-bids`, params],
    () => getCustomerBidsForStylistApi(params)
  );

  return {
    bids: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

// Hook to get stylist offers (to filter out bids they've already responded to)
export const useStylistOffers = (
  params: PaginationParams = { page: 1, limit: 100 }
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`stylist-offers`, params],
    () => getStylistOffersApi(params)
  );

  return {
    offers: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

export const useBidDetails = (bidId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    bidId ? [`bid-details`, bidId] : null,
    () => getBidDetailsApi(bidId)
  );

  return {
    bid: data || null,
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

export const useCreateBid = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createBidByCustomer = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await createBidByCustomerApi(data);
      return { success: true, data: response };
    } catch (err) {
      if (err instanceof AxiosError) {
        const { response } = err;
        const errorMessage = response?.data?.error || "Bid creation failed";
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createBidByCustomer, isLoading }
}

export const useCreateOfferByStylist = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createOfferByStylist = async (bid_id: string, payload: { customer_id: string, style_id: string, price: number, delivery_date: string }) => {
    try {
      setIsLoading(true);
      console.log("Creating offer with bid_id:", bid_id, "payload:", payload);
      const response = await createOfferByStylistApi(bid_id, payload);
      console.log("Offer creation response:", response);
      return { success: true, data: response };
    } catch (err) {
      console.error("Error in createOfferByStylist:", err);
      if (err instanceof AxiosError) {
        const { response } = err;
        console.error("Axios error response:", response?.data);
        const errorMessage = response?.data?.error || response?.data?.message || "Offer creation failed";
        return { success: false, error: errorMessage };
      }
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  return { createOfferByStylist, isLoading }
}
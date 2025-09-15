import { getAllStylesApi, getAllStylistsApi, getFilteredStylesApi, getFilteredStylistsApi } from "@/lib/api/browse";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 10;

// get infinite scroll paginated stylists
export const usePaginatedStylists = () => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return [`stylists-page`, pageIndex + 1];
  }

  const fetcher = async ([_, page]: [string, number]) => {
    return getAllStylistsApi({ page, limit: PAGE_SIZE });
  };

  const {
    data,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: true,
  });

  const stylists = data ? data.flatMap((res) => res) : [];
  const hasMore = data?.[data.length - 1]?.data?.length === PAGE_SIZE;

  return {
    stylists,
    isLoading,
    isRefreshing: isValidating && size === 1,
    isLoadingMore: isValidating && size > 1,
    loadMore: () => hasMore && setSize(size + 1),
    hasMore,
    mutate,
    error,
  };
}

// get all stylists hook
export const useAllStylists = (
  params: PaginationParams = { page: 1, limit: 10 },
  options: { revalidateOnFocus?: boolean } = {}
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`all-stylists`, params],
    () => getAllStylistsApi(params),
    {
      dedupingInterval: 3000,
      revalidateOnFocus: options.revalidateOnFocus ?? false,
      ...options,
    }
  );

  return {
    stylists: data?.data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

// get filtered stylists hook
export const useFilteredStylists = (
  filter: Record<string, any> = {},
  options: { revalidateOnFocus?: boolean } = {}
) => {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return [`filtered-stylists`, pageIndex + 1, JSON.stringify(filter)];
  }

  const fetcher = async ([, page, filter]: [string, number, Record<string, any>]) => {
    return getFilteredStylistsApi({ page, limit: PAGE_SIZE }, filter);
  };

  const {
    data,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSWRInfinite(getKey, fetcher, {
    dedupingInterval: 3000,
    revalidateOnFocus: options.revalidateOnFocus ?? false,
    ...options,
  });
  const stylists = data ? data.flatMap((res) => res || []) : [];
  const hasMore = data?.[data.length - 1]?.data?.length === PAGE_SIZE;

  return {
    stylists,
    isLoading,
    isRefreshing: isValidating && size === 1,
    isLoadingMore: isValidating && size > 1,
    loadMore: () => hasMore && setSize(size + 1),
    hasMore,
    mutate,
    error,
  };
};

// get all styles hook
export const useAllStyles = (
  params: PaginationParams = { page: 1, limit: 10 },
  options: { revalidateOnFocus?: boolean } = {}
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`all-styles`, params],
    () => getAllStylesApi(params),
    {
      dedupingInterval: 3000,
      revalidateOnFocus: options.revalidateOnFocus ?? true, // Default to true for tab refreshing
      ...options,
    }
  );

  return {
    styles: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};

// get filtered styles hook
export const useFilteredStyles = (
  params: PaginationParams = { page: 1, limit: 10 },
  filter: Record<string, any> = {},
  options: { revalidateOnFocus?: boolean } = {}
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`filtered-styles`, params, JSON.stringify(filter)],
    () => getFilteredStylesApi(params, filter),
    {
      dedupingInterval: 3000,
      revalidateOnFocus: options.revalidateOnFocus ?? false,
      ...options,
    }
  );

  return {
    styles: data || [],
    error: error?.message || null,
    isLoading,
    mutate,
  };
};
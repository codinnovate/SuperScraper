import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Simple tab refetch hook that calls a function ONCE when tab comes into focus
 * Prevents infinite loops by using refs and strict focus tracking
 */
export const useSimpleTabRefetch = (
    refetchFunction: () => void | Promise<any>,
    enabled = true
) => {
    const hasFocusedOnceRef = useRef<boolean>(false);
    const isCurrentlyFocusedRef = useRef<boolean>(false);
    const refetchFunctionRef = useRef(refetchFunction);

    // Update the ref when the function changes
    refetchFunctionRef.current = refetchFunction;

    useFocusEffect(
        useCallback(() => {
            if (!enabled) return;

            // Skip the very first mount
            if (!hasFocusedOnceRef.current) {
                hasFocusedOnceRef.current = true;
                isCurrentlyFocusedRef.current = true;
                return;
            }

            // Only trigger if we weren't already focused (i.e., coming from another tab)
            if (!isCurrentlyFocusedRef.current) {
                isCurrentlyFocusedRef.current = true;

                try {
                    const result = refetchFunctionRef.current();
                    if (result instanceof Promise) {
                        result.then(() => { }).catch((error) => { });
                    } else {

                    }
                } catch (error) {
                }
            }

            return () => {
                // Mark as unfocused when leaving
                isCurrentlyFocusedRef.current = false;
            };
        }, [enabled])
    );
};

/**
 * Home tab specific refetch hook
 */
export const useHomeTabRefetch = (
    mutateStylistsFunction: () => Promise<any>,
    mutateStylesFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateStylistsFunction();
        mutateStylesFunction();
    }, [mutateStylistsFunction, mutateStylesFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

/**
 * Favourites tab specific refetch hook
 */
export const useFavouritesTabRefetch = (
    mutateFavouritesFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateFavouritesFunction();
    }, [mutateFavouritesFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

/**
 * Account tab specific refetch hook
 */
export const useAccountTabRefetch = (
    mutateProfileFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateProfileFunction();
    }, [mutateProfileFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

// ===== STYLIST TAB REFETCH HOOKS =====

/**
 * Stylist Home tab specific refetch hook
 */
export const useStylistHomeTabRefetch = (
    mutateStylistStylesFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateStylistStylesFunction();
    }, [mutateStylistStylesFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

/**
 * Stylist Orders tab specific refetch hook (for My Orders)
 */
export const useStylistOrdersTabRefetch = (
    mutateOrdersFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateOrdersFunction();
    }, [mutateOrdersFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

/**
 * Stylist Client Bids tab specific refetch hook
 */
export const useStylistBidsTabRefetch = (
    mutateBidsFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateBidsFunction();
    }, [mutateBidsFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

/**
 * Stylist Account tab specific refetch hook
 */
export const useStylistAccountTabRefetch = (
    mutateProfileFunction: () => Promise<any>,
    mutateReviewsFunction: () => Promise<any>,
    enabled = true
) => {
    const refetchCallback = useCallback(() => {
        mutateProfileFunction();
        mutateReviewsFunction();
    }, [mutateProfileFunction, mutateReviewsFunction]);

    useSimpleTabRefetch(refetchCallback, enabled);
};

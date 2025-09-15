import { useNotificationContext } from "@/contexts/NotificationContext";
import { createOrderApi, getBanksApi, getOrderByIdApi, getOrdersApi, stylistUpdateOrder as stylistUpdateOrderApi } from "@/lib/api/order";
import { Order } from "@/types/order.types";
import { AxiosError } from "axios";
import { useState } from "react";
import useSWR from "swr";

export const useOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { scheduleOrderNotification } = useNotificationContext();

    const createOrder = async (payload: Omit<Order, "id" | "created_at">) => {
        try {
            setIsLoading(true);
            console.log("useOrder: Creating order with payload:", payload);
            const response = await createOrderApi(payload);
            console.log("useOrder: Order creation successful:", response);

            // Schedule local notification for order creation
            if (response.order) {
                await scheduleOrderNotification(
                    "Order Created",
                    `Your order #${response.order.id} has been created successfully`,
                    response.order.id
                );
            }

            return { success: true, data: response };
        } catch (err) {
            console.error("useOrder: Order creation failed:", err);
            if (err instanceof AxiosError) {
                const { response } = err;
                console.error("useOrder: Axios error response:", response?.data);
                const errorMessage = response?.data?.error || response?.data?.message || "Order creation failed";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "An unexpected error occurred" };
        } finally {
            setIsLoading(false);
        }
    }

    const getOrders = (params?: { status?: string }) => {
        const { data, error, isLoading, mutate } = useSWR(
            [`orders`, params],
            () => getOrdersApi(params)
        );

        return {
            orders: data || [],
            error: error?.message || null,
            isLoading,
            mutate
        };
    }

    const getOrderById = (orderId: string) => {
        const { data, error, isLoading, mutate } = useSWR(
            [`order`, orderId],
            () => getOrderByIdApi(orderId)
        );

        return {
            order: data.order || null,
            error: error?.message || null,
            isLoading,
            mutate
        };
    }

    const stylistUpdateOrder = async (id: string, payload: Omit<Order, "id" | "created_at">) => {
        try {
            setIsLoading(true);
            const response = await stylistUpdateOrderApi(id, payload);
            return { success: true, data: response };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Order update failed";
                return { success: false, error: errorMessage };
            }
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, createOrder, getOrders, getOrderById, stylistUpdateOrder };
}

export const useBank = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "banks",
        getBanksApi
    );

    return {
        banks: data || [],
        error: error?.message || null,
        isLoading,
        mutate
    };
}

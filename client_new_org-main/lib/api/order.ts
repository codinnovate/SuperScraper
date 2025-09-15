import { Order, SubAccountPayload } from "@/types/order.types";
import { OrderStatus } from "@/types/stylist.types";
import apiClient from "./api-client";

export const createOrderApi = async (payload: Omit<Order, "id" | "created_at">) => {
    console.log("Creating order with payload:", payload);
    const response = await apiClient.post("/orders", payload);
    console.log("Order creation response:", response.data);
    return response.data;
}

export const getOrdersApi = async (params?: { status?: string }) => {
    const response = await apiClient.get("/orders/all", { params })
    return response.data
}

export const getOrderByIdApi = async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
}

export const stylistUpdateOrder = async (orderId: string, payload: Omit<Order, "id" | "created_at">) => {
    const response = await apiClient.put(`/orders/${orderId}`, payload)
    return response.data
}

export const updateOrderApi = async (payload: { orderId: string, status: OrderStatus }) => {
    const response = await apiClient.put(`/orders/${payload.orderId}/status`, { status: payload.status })
    return response.data
}

export const initiatePaymentApi = async (payload: { order_id: string, stylist_id: string, amount: number, email: string }) => {
    const response = await apiClient.post("/payment/initiate", payload)
    return response.data
}

export const getBanksApi = async () => {
    const response = await apiClient.get("/payment/banks")
    return response.data
}

export const saveAccountDetailsApi = async (payload: FormData) => {
    const response = await apiClient.put("/users/update", payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export const createSubAccountApi = async (payload: SubAccountPayload) => {
    const response = await apiClient.post("/payment/paystack_subaccount", payload)
    return response.data
}
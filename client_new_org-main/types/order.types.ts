import { OrderStatus } from "./stylist.types";

export interface OrderDetails {
    out_fit_fee: string;
    delivery_fee: string;
    discount_amount?: string;
    delivery_location: string;
    delivery_date: string;
}

export interface Order {
    id: string;
    customer_id: string;
    customer_name?: string;
    stylist_id: string;
    conversation_id: string;
    order_details: OrderDetails;
    status: OrderStatus;
    created_at: string;
}

export interface Bank {
    id: number;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string;
    pay_with_bank: boolean;
    active: boolean;
    is_deleted: boolean;
    country: string;
    currency: string;
}

export interface SubAccountPayload {
    user_id: string;
    business_name: string;
    settlement_bank: string;
    email: string;
    phone: string;
    contact_name: string;
    account_number: string;
    percentage_charge: number;
}
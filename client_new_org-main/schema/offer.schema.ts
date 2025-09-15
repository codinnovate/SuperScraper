import * as yup from "yup";

export const offerSchema = yup.object({
    price: yup.number().required("Price is required").min(1, "Price must be at least 1"),
    delivery_date: yup.string().required("Delivery date is required"),
});
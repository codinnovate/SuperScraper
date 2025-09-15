import * as yup from "yup";

export const createOrderSchema = yup.object({
    out_fit_fee: yup.string().required().test('is-number', 'Outfit fee must be a valid number', (value) => {
        if (!value) return false;
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    }),
    // delivery_fee: yup.number().required(),
    delivery_location: yup.string().required(),
})
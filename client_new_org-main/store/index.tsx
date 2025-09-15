import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import customerReducer from "@/features/customer/customerSlice";
import stylistReducer from "@/features/stylist/stylistSlice";
import customerFavouriteReducer from "@/features/customer/favouritesSlice";
import allStylistsSlice from "@/features/customer/allStylistsSlice";
import notificationSlice from "@/features/notificationSlice";
import bidsSlice from "@/features/stylist/bidsSlice";

export const store = configureStore({
  reducer: {
    user: authReducer,
    customer: customerReducer,
    stylist: stylistReducer,
    customerFavourites: customerFavouriteReducer,
    styles: allStylistsSlice, // This key must match useAppSelector((state) => state.styles)
    notifications: notificationSlice, // This key must match useAppSelector((state) => state.notifications)
    bids: bidsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

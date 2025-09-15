import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth.types";
import apiClient from "./api-client";

export const loginUserApi = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", payload, {
    authRequired: false,
  });
  return response.data;
};

export const registerUserApi = async (
  payload: RegisterPayload
): Promise<{ message: string, verification_id: string }> => {
  const response = await apiClient.post("/auth/register", payload, {
    authRequired: false,
  });
  return response.data;
};

export const forgotPasswordApi = async (payload: {
  email: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.post("/auth/password/reset", payload, {
    authRequired: false,
  });
  return response.data;
};

export const verifyPinApi = async (payload: {
  email: string;
  code: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.post(
    "/auth/password/reset/verify",
    payload,
    {
      authRequired: false,
    }
  );
  return response.data;
};

export const resetPasswordApi = async (payload: {
  email: string;
  code: string;
  new_password: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.post(
    "/auth/password/reset/confirm",
    payload,
    {
      authRequired: false,
    }
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<IUser> => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

export const updateUserProfileApi = async (payload: FormData) => {
  const response = await apiClient.put("/users/update", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("Uploading image:", response.data);
  return response.data;
};

export const changePasswordApi = async (payload: {
  old_password: string;
  new_password: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.post(
    "/auth/secure/password/change",
    payload
  );
  return response.data;
};

export const setDeviceTokenApi = async (payload: {
  device_token: string;
}) => {
  const response = await apiClient.post(
    "/notifications/device-token/register",
    payload
  );
  return response.data;
};

export const connectAuthProviderApi = async (payload: {
  provider: string;
  access_token: string;
  user_type: "customer" | "stylist"
}) => {
  const response = await apiClient.post("/providers/connect", payload, {
    authRequired: false,
  });
  return response.data;
};

export const verifyEmailApi = async (payload: {
  verification_id: string,
  code: string,
  type: string
}) => {
  const res = await apiClient.post("/auth/email/verify", payload, {
    authRequired: false,
  })
  return res.data;
}

export const resendVerifyEmailOtpApi = async (email: string) => {
  const res = await apiClient.post("/auth/email/verify/resend", { email })
  return res.data;
}
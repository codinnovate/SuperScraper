import axios from "../api/axiosInstance";
import * as SecureStore from "expo-secure-store";

const login = async (email: string, password: string) => {
  const { data } = await axios.post("/auth/login", { email, password });
  await SecureStore.setItemAsync("accessToken", JSON.stringify(data.user));
  return data;
};

const signup = async (email: string, password: string, role: string, address: string, fullname: string) => {
  const { data } = await axios.post("/auth/signup", { email, password, role });
  await SecureStore.setItemAsync("accessToken", JSON.stringify(data.user));
  return data;
};

const getUserFromToken = async (token: string) => {
  return JSON.parse(token); // For mock, token is stringified user
};

export default {
  login,
  signup,
  getUserFromToken,
};

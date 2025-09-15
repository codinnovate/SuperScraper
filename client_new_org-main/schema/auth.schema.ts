import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

export const signUpSchema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  address: yup.string().required("Address is required"),
});

export const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required("Current password is required"),
  new_password: yup.string().min(6, "Minimum 6 characters").required("New password is required"),
  confirm_new_password: yup.string().oneOf([yup.ref("new_password"), undefined], "Passwords must match").required("Confirm new password is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string().min(6, "Minimum 6 characters").required("New password is required"),
  confirmNewPassword: yup.string().oneOf([yup.ref("newPassword"), undefined], "Passwords must match").required("Confirm new password is required"),
});
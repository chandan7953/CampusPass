import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .required("OTP is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export const editProfileSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  department: yup.string(),
  year: yup.string(),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
});

export const eventSchema = yup.object().shape({
  title: yup.string().required("Event title is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  venue: yup.string().required("Venue is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date cannot be before start date")
    .required("End date is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .min(1, "Capacity must be at least 1")
    .required("Capacity is required"),
});

export const ticketSchema = yup.object().shape({
  title: yup.string().required("Ticket title is required"),
  description: yup.string(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .default(0),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  saleStartDate: yup.date(),
  saleEndDate: yup.date(),
});

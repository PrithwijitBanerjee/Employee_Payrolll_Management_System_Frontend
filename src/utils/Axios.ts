import axios from "axios";
import { store } from "@/redux/store";
import toast from "react-hot-toast";
import { logoutUser } from "@/redux/Authentication/authSlice";
import { Logout } from "@/utils/Endpoints";

const Axios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  }
});

// Fixed request interceptor - now returns the config
Axios.interceptors.request.use(function (config) {
  const { token } = store.getState().auth;

  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = token;
  }

  // Handle content type for file uploads (commented out but fixed)
  // if (config.url === endpoints.uploadProject || config.url === endpoints.profileImage) {
  //   config.headers["Content-Type"] = "multipart/form-data";
  // }

  // Role-based URL prefixing (commented out but fixed)
  // if (config.url !== endpoints.login) {
  //   const { profile } = store.getState().auth;
  //   config.url = `/${profile?.role?.toLowerCase()}${config.url}`;
  // }

  return config; // ← This is the crucial fix
}, function (error) {
  return Promise.reject(error);
});

// Response interceptor (already correct)
Axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response && error.response.status === Logout) {
    store.dispatch(logoutUser());
    toast.error("Please login to continue.");
  } else {
    if (!error.response) {
      // Network Error (No Response)
      return Promise.reject({
        data: {
          status: false,
          message: "Network error! Please check your internet connection.",
        },
      });
    } else {
      return Promise.reject(error.response);
    }
  }
});

export default Axios;
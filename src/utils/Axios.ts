import axios from "axios";

const Axios = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
    headers: {
         "Content-Type": "application/json",
    }
});


Axios.interceptors.request.use(function (config) {

  const { token, profile } = store.getState().user;
  config.headers.Authorization = token;
  if (config.url === endpoints.uploadProject || config.url === endpoints.profileImage) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  if (config.url === endpoints.login) {
    return config;
  } else {
    return {
      ...config,
      url: `/${profile?.role.toLowerCase()}${config.url}`
    };
  }

}, function (error) {
  return Promise.reject(error);
});

Axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {

  if (error.response && error.response.status === Logout) {

    store.dispatch(logoutUser());
    toast.error("Please login to continue.");
    // return Promise.reject(errorData)

  } else {
    if (!error.response) {
      // **Network Error (No Response)**
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
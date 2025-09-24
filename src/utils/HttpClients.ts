// import { CommonResponseType } from "@types/index.ts";
// import { CommonResponseType } from "";
import type { CommonResponseType } from "@/@types/index";
import Axios from "./Axios";

// Update other methods similarly with generic types
const getRequest = async <T = CommonResponseType>(url: string, config: object = {}): Promise<T> => {
    try {
        const response = await Axios.get(url, config);
        return response?.data;
    } catch (error: any) {
        throw error?.response?.data || error?.data || error;
    }
};

const postRequest = async <T = CommonResponseType>(url: string, data: object = {}, config: object = {}): Promise<T> => {
    try {
        const response = await Axios.post(url, data, config);
        return response?.data;
    } catch (error: any) {
        // For proper error handling with rejectWithValue, throw the error
        // so it can be caught by rejectWithValue in the thunk
        throw error?.response?.data || error?.data || error;
    }
};

const putRequest = async <T = CommonResponseType>(url: string, data: object = {}, config: object = {}): Promise<T> => {
    try {
        const response = await Axios.put(url, data, config);
        return response?.data;
    } catch (error: any) {
        return error?.data;
    }
};

const patchRequest = async <T = CommonResponseType>(url: string, data: object = {}, config: object = {}): Promise<T> => {
    try {
        const response = await Axios.patch(url, data, config);
        return response?.data;
    } catch (error: any) {
        // console.log("error: ", error);

        return error?.data;
    }
};

// const deleteRequest = async (url: string, config: object = {}): Promise<CommonResponseType> => {
//     try {
//         console.log("config: ", config);
//         console.log("url: ", url);

//         const response = await Axios.delete(url, config);
//         return response?.data;
//     } catch (error: any) {
//         return error?.data;
//     }
// };

const deleteRequest = async <T = CommonResponseType>(url: string, data: object = {}, config: object = {}): Promise<T> => {
    try {
        // console.log(data);
        const response = await Axios.delete(url, { ...config, data });
        return response?.data;
    } catch (error: any) {
        return error?.data;
    }
};

const HttpClients = {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    patchRequest,
};

export default HttpClients;
// import { CommonResponseType } from "@types/index.ts";
// import { CommonResponseType } from "";
import type { CommonResponseType } from "@/@types/index";
import Axios from "./Axios";

const getRequest = async (url: string, config: object = {}): Promise<CommonResponseType> => {
    try {
        const response = await Axios.get(url, config);
        return response?.data;
    } catch (error: any) {
        return error?.data;
    }
};

const postRequest = async (url: string, data: object = {}, config: object = {}): Promise<CommonResponseType> => {
    try {
        const response = await Axios.post(url, data, config);
        return response?.data;
    } catch (error: any) {
        return error?.data;
    }
};

const putRequest = async (url: string, data: object = {}, config: object = {}): Promise<CommonResponseType> => {
    try {
        const response = await Axios.put(url, data, config);
        return response?.data;
    } catch (error: any) {
        return error?.data;
    }
};

const patchRequest = async (url: string, data: object = {}, config: object = {}): Promise<CommonResponseType> => {
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

const deleteRequest = async (url: string, data: object = {}, config: object = {}): Promise<CommonResponseType> => {
    try {
        // console.log(data);

        const response = await Axios.delete(url, { ...config, data });
        return response?.data;
    } catch (error: any) {
        return error?.data;
    }
};

export {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    patchRequest,
};
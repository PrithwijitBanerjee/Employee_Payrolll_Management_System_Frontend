// MISReports/allotedToMe.ts
import Endpoints from "@/utils/Endpoints";
import HttpClients from "@/utils/HttpClients";

export const generateReportAllotedToMe = async (): Promise<ArrayBuffer> => {
    try {
        // Ask Axios to give you raw bytes instead of a string
        const res = await HttpClients.getRequest<ArrayBuffer>(
            Endpoints.reportAllotedToMe,
            { responseType: "arraybuffer" }  // <--- key change
        );

        return res; // this is an ArrayBuffer now
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }
};
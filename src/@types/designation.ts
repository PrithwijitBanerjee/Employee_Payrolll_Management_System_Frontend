export type DesignationInpType = {
    DesgName: string,
    DesgStatus: string,
};

export type DesignationSlice = {
    status: string,
    error: any,
    designations: [],
    designation: object | null,
    desgCode?: string | any,
};

export type DesignationRespType = {
    status: boolean,
    message: string,
    data: any,
};

export type UpdateDesignationType = {
    id: string,
    DesgName: string,
    DesgStatus: string,
};

export type DesignationArrType = {
    DesgCode: string,
    DesgName: string,
    DesgStatus: string,
    createdAt?: string,
    updatedAt?: string,
    status: {
        code: string,
        data: string,
    } | null,
};
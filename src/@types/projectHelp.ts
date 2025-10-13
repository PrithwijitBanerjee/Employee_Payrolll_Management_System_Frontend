export type ProjectHelpInpType = {
    data: string,
    tag: string,
};

export type UpdateProjectHelpInpType = {
    data: string,
    tag: string,
    id: string,
};

export type ProjectHelpSlice = {
    status: string,
    error: any,
    projectHelps: [],
    projectHelp: object | null,
};

export type ProjectHelpResp = {
    status: boolean,
    message: string,
    data?: object | null | any,
};

export type ProjectHelpArrType = {
    code: string,
    data: string,
    tag: string,
    createdAt?: string,
    updatedAt?: string,
};


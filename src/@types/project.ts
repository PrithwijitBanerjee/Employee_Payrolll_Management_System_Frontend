export type ProjectInpType = {
    ProjectName: string,
    SGSTRate: string,
    CGSTRate: string,
    IGSTRate: string,
    ProjectStatus: string,
};

export type ProjectSlice = {
    status: string,
    error: any,
    projects: [],
    project: object | null,
};

export type ProjectRespType = {
    status: boolean,
    message: string,
    data: any,
};

export type UpdateProjectType = {
    id: string,
    ProjectName: string,
    SGSTRate: string,
    CGSTRate: string,
    IGSTRate: string,
    ProjectStatus: string,
};

export type ProjectArrType = {
    ProjectCode: string,
    ProjectName: string,
    SGSTRate: string,
    CGSTRate: string,
    IGSTRate: string,
    ProjectStatus: string,
    createdAt?: string,
    updatedAt?: string,
    status: {
        code: string,
        data: string,
    } | null,
};
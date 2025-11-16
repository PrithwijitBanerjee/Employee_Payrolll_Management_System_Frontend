export type JobDetailType = {
    id: string | number,
    JobMasterNo: string | number,
    JobNo?: number | string,
    ClientCode: string,
    ProjectCode: string,
    Particulars: string,
    ExpDelvDate: string,
    JobStatus: string,
    BasicAmount: number | string,
    DiscRate: number | string,
    DiscAmount: number | string,
    GrossAmount: number | string,
    SGSTRate: number | string,
    SGSTAmount: number | string,
    CGSTRate: number | string,
    CGSTAmount: number | string,
    IGSTRate: number | string,
    IGSTAmount: number | string,
    NetAmount: number | string,
    status?: {
        data?: string,
    } | null,
    client?: {
        ClientName?: string,
    } | null,
    project?: {
        ProjectName?: string,
    } | null,
};

export type JobDetailSlice = {
    status: string,
    error: any,
    jobDetails: [],
    jobDetail: JobDetailType | null,
};

export type JobDetailRespType = {
    status: boolean,
    success?: boolean,
    message: string,
    data: JobDetailType[] | null | any,
};

export type UpdateJobDetailType = {
    id: string,
    JobMasterNo: string,
    JobNo?: number | string,
    ClientCode: string,
    ProjectCode: string,
    Particulars: string,
    ExpDelvDate: string,
    JobStatus: string,
    BasicAmount: number | string,
    DiscRate: number | string,
    DiscAmount: number | string,
    GrossAmount: number | string,
    SGSTRate: number | string,
    SGSTAmount: number | string,
    CGSTRate: number | string,
    CGSTAmount: number | string,
    IGSTRate: number | string,
    IGSTAmount: number | string,
    NetAmount: number | string,
};

export type JobDetailInpType = {
    ClientCode: string,
    ProjectCode: string,
    Particulars: string,
    ExpDelvDate: string,
    JobStatus: string,
    BasicAmount: number | string,
    DiscRate: number | string,
    DiscAmount: number | string,
};
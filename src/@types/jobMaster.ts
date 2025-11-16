export type JobMasterType = {
    JobNo?: number | string,
    JobDate: string,
    JobFrom: string,
    JobTo: string,
    BasicAmount: number | string,
    DiscAmount: number | string,
    TaxAmount: number | string,
    NetAmount: number | string,
    JobStat: string | number,
    fromUser?: {
        EmplName?: string,
    } | null,
    toUser?: {
        EmplName?: string,
    } | null,
    GrossAmount: number | string,
    status?: {
        data?: string,
    }
};

export type JobMasterSlice = {
    status: string,
    error: any,
    jobMasters: JobMasterType[] | [],
};

export type JobMasterRespType = {
    status: boolean,
    success?: boolean,
    message: string,
    data: JobMasterType[] | null | any,
};


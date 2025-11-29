export type TASKINPTYPE = {
    JobNo: string;
    JobTo: string;
    StartTime: string;
    EndTime: string;
    Particulars: string;
    TaskStatus: string;
    Remarks: string;
    ClientCode?: string;
    ProjectCode?: string;
};

export type TaskArrType = {
    TaskId: string | number,
    TaskDate: string;
    EmplCode: string;
    JobNo: string;
    ClientCode: string;
    ProjectCode: string;
    StartTime: string;
    EndTime: string;
    DurationMin: string | number;
    Particulars: string;
    TaskStatus: string;
    JobTo: string;
    Remarks: string;
    client?: {
        ClientName?: string,
    };
    employee?: {
        EmplName?: string,
    },
    status?: {
        data?: string,
    },
    project?: {
        ProjectName?: string,
    },
};

export type TaskDetailSlice = {
    status: string,
    error: any,
    taskDetails: TaskArrType[] | [],
    taskDetail: TaskArrType | null,
};

export type TaskDetailRespType = {
    status: boolean,
    success?: boolean,
    message: string,
    data: [] | null | any,
};

export type UpdateTaskDetailType = {
    id: string;
    TaskId?: string | number,
    TaskDate?: string;
    EmplCode?: string;
    JobNo?: string;
    ClientCode?: string;
    ProjectCode?: string;
    StartTime?: string;
    EndTime?: string;
    DurationMin?: string | number;
    Particulars?: string;
    TaskStatus?: string;
    JobTo?: string;
    Remarks?: string;
    client?: {
        ClientName?: string,
    };
    employee?: {
        EmplName?: string,
    },
    status?: {
        data?: string,
    },
    project?: {
        ProjectName?: string,
    },
};
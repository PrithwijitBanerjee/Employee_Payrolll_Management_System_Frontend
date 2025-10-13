export type EmployeeInpType = {
    EmplName: string,
    EmplTag: string,
    EmplType: string,
    DeptCode: string,
    DesgCode: string,
    DOB: string,
    DOJ: string,
    UserID: string,
    Password: string,
    EmplStatus: string,
};

export type EmployeeSlice = {
    status: string,
    error: any,
    employees: [],
    employee: object | null,
};

export type EmployeeRespType = {
    status: boolean,
    message: string,
    data: any,
};

export type UpdateEmployeeType = {
    id: string,
    EmplName: string,
    EmplTag: string,
    EmplType: string,
    DeptCode: string,
    DesgCode: string,
    DOB: string,
    DOJ: string,
    UserID: string,
    Password: string,
    EmplStatus: string,
};

export type EmployeeArrType = {
    EmplCode: string,
    EmplName: string,
    EmplTag: string,
    EmplType: string,
    DeptCode: string,
    DesgCode: string,
    DOB: string,
    DOJ: string,
    UserID: string,
    Password: string,
    EmplStatus: string,
    createdAt?: string,
    updatedAt?: string,
    status: {
        code: string,
        data: string,
    } | null,
};
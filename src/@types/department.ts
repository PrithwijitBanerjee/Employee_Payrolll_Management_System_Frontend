export type DepartmentSlice = {
    status: string,
    error: any,
    departments: [],
    department: object | null,
    deptCode?: string | any,
};

export type DepartmentType = {
    DeptName: string,
    DeptStatus: string,
};

export type DepartmentRespType = {
    status: boolean,
    message: string,
    data: any,
};

export type UpdateDepartmentType = {
    id: string,
    DeptName: string,
    DeptStatus: string,
};

export type DepartmentArrType = {
    DeptCode: string,
    DeptName: string,
    DeptStatus: string,
    createdAt?: string,
    updatedAt?: string,
    status: {
        code: string,
        data: string,
    } | null,
};
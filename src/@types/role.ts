export type RoleArrType = {
    id: number,
    roleName: string,
};

export type RoleRespType = {
    status: boolean,
    message: string,
    data?: Array<RoleArrType>,
};

export type RoleSlice = {
   status: string,
   roles?: Array<RoleArrType>,
   error?: any,
   role: object | null,
};

export type RoleInputType = {
    role: string,
    roleName?: string,
};

export type UpdateRoleInpType = {
   role: string,
   id: number,
};
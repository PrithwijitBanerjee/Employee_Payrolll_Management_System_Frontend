type RoleNameType = {
    id: number | null,
    roleName: string | null,
}

type UserDataType = {
    id: number,
    name: string | null,
    email: string | null;
    role: number | null,
    createdAt: string | null,
    updatedAt: string | null,
    roleName?: RoleNameType | null,
};

export type UserSlice = {
    isLoggedIn: boolean,
    status: string,
    error?: any,
    token: string | null,
    userData: UserDataType | null,
    redirectTo?: string | null,
    redirectReg?: string | null,
};

export type UserSignUpCredentialsType = {
    name: string,
    email: string,
    password: string,
    role: number,
};

export type UserSignUpResponse = {
    status: boolean,
    message: string,
    error?: string,
    data: {
        user: UserDataType,
        token: string | null,
    },
};

export type UserSignInCredentialsType = {
    email: string,
    password: string,
};

export type UserSignInResponse = UserSignUpResponse;
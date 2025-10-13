export type ClientInpType = {
    ClientName: string,
    ClientStatus: string,
};

export type ClientSlice = {
    status: string,
    error: any,
    clients: [],
    client: object | null,
};

export type ClientRespType = {
    status: boolean,
    message: string,
    data: any,
};

export type UpdateClientType = {
    id: string,
    ClientName: string,
    ClientStatus: string,
};

export type ClientArrType = {
    ClientCode: string,
    ClientName: string,
    ClientStatus: string,
    createdAt?: string,
    updatedAt?: string,
    status: {
        code: string,
        data: string,
    } | null,
};
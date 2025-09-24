import type { ReactNode } from "react";

export type ApiError = {
    code?: string;
    message: string;
    details?: Record<string, unknown>;
};

export type CommonResponseType<T = unknown> = {
    status: boolean
    message: string
    data?: T
    error?: ApiError | string
    totalPage?: number
};

export type CommonPropsType = {
    children: ReactNode,
}
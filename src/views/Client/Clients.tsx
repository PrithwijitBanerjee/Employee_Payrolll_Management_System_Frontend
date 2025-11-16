import React, { useEffect, type FormEvent } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";
import { convertDate } from "@/utils";
import { deleteClient, getAllClients } from "@/redux/Clients/clientSlice";
import type { ClientArrType } from "@/@types/client";

const Clients: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { clients, status } = useAppSelector(state => state.client);

    useEffect(() => {
        dispatch(getAllClients());
    }, [dispatch]);

    // Example dynamic columns
    const columns = [
        // {
        //     key: "ClientCode",
        //     name: "Client Code",
        //     selector: (_: ClientArrType) => _.ClientCode,
        //     render: (_: ClientArrType) => _.ClientCode,
        //     sortable: false, // Disable sorting for serial numbers
        // },
        {
            key: "ClientName",
            name: "Client Name",
            selector: (row: ClientArrType) => row?.ClientName || "-",
            render: (row: ClientArrType) => row.ClientName || "-",
            sortable: true,
        },
        {
            key: "ClientStatus",
            name: "Client Status",
            selector: (row: ClientArrType) => row?.status?.data || "-",
            render: (row: ClientArrType) => row?.status?.data || "-",
            sortable: true,
        },
        {
            key: "createdAt",
            name: "Created At",
            selector: (row: ClientArrType) => convertDate(row?.createdAt as string) || "-",
            render: (row: ClientArrType) => convertDate(row.createdAt as string) || "-",
            sortable: true,
        },
        {
            key: "updatedAt",
            name: "Updated At",
            selector: (row: ClientArrType) => convertDate(row?.updatedAt as string) || "-",
            render: (row: ClientArrType) => convertDate(row.updatedAt as string) || "-",
            sortable: true,
        },
    ];

    const handleEdit = (row: ClientArrType): void => {
        navigate(`/client/update/${row?.ClientCode}/true`);
    };

    const handleDelete = async (row: ClientArrType): Promise<void> => {
        try {
            // console.log("delete id: ", row.ClientCode);

            dispatch(deleteClient(row.ClientCode)).then(() => dispatch(getAllClients()));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete client");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={clients as ClientArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="Client List"
                searchable={false}
                buttonText={"Add New Client"}
                isAddPaginateBtn={true}
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/client/add");
                }}
            // filteredDropdownForImages={true}
            />
        </>
    );
};

export default Clients;
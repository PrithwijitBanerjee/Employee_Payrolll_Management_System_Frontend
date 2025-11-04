import React, { useEffect, type FormEvent } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";
// import { convertDate } from "@/utils";
import type { DesignationArrType } from "@/@types/designation";
import { deleteDesignation, getAllDesignations } from "@/redux/Designations/designationSlice";

const Designations: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { designations, status } = useAppSelector(state => state.designation);

    useEffect(() => {
        dispatch(getAllDesignations());
    }, [dispatch]);

    // Example dynamic columns
    const columns = [
        {
            key: "DesgCode",
            name: "Designation Code",
            selector: (_: DesignationArrType) => _.DesgCode,
            render: (_: DesignationArrType) => _.DesgCode,
            sortable: false, // Disable sorting for serial numbers
        },
        {
            key: "DesgName",
            name: "Designation Name",
            selector: (row: DesignationArrType) => row?.DesgName || "-",
            render: (row: DesignationArrType) => row.DesgName || "-",
            sortable: true,
        },
        {
            key: "DesgStatus",
            name: "Designation Status",
            selector: (row: DesignationArrType) => row?.status?.data || "-",
            render: (row: DesignationArrType) => row?.status?.data || "-",
            sortable: true,
        },
        // {
        //     key: "createdAt",
        //     name: "Created At",
        //     selector: (row: DesignationArrType) => convertDate(row?.createdAt as string) || "-",
        //     render: (row: DesignationArrType) => convertDate(row.createdAt as string) || "-",
        //     sortable: true,
        // },
        // {
        //     key: "updatedAt",
        //     name: "Updated At",
        //     selector: (row: DesignationArrType) => convertDate(row?.updatedAt as string) || "-",
        //     render: (row: DesignationArrType) => convertDate(row.updatedAt as string) || "-",
        //     sortable: true,
        // },
    ];

    const handleEdit = (row: DesignationArrType): void => {
        navigate(`/designation/update/${row?.DesgCode}/true`);
    };

    const handleDelete = async (row: DesignationArrType): Promise<void> => {
        try {
            // console.log("delete id: ", row.DesgCode);

            dispatch(deleteDesignation(row.DesgCode)).then(() => dispatch(getAllDesignations()));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete designation");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={designations as DesignationArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="Designation List"
                searchable={false}
                buttonText={"Add New Designation"}
                isAddPaginateBtn={true}
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/designation/add");
                }}
            // filteredDropdownForImages={true}
            />
        </>
    );
};

export default Designations;
import React, { useEffect } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";
import type { ProjectHelpArrType } from "@/@types/projectHelp";
import { deleteProjectHelp, getAllProjectHelps } from "@/redux/ProjectHelp/projectHelpSlice";
// import { convertDate } from "@/utils";
import { type FormEvent } from 'react';

const ProjectHelps: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { projectHelps, status } = useAppSelector(state => state.projectHelp);

    useEffect(() => {
        dispatch(getAllProjectHelps());
    }, [dispatch]);

    // Example dynamic columns
    const columns = [
        {
            key: "id",
            name: "ID",
            selector: (_: ProjectHelpArrType, index: number) => index + 1,
            render: (_: ProjectHelpArrType, index: number) => index + 1,
            sortable: false, // Disable sorting for serial numbers
        },
        {
            key: "data",
            name: "Project Status",
            selector: (row: ProjectHelpArrType) => row?.data || "-",
            render: (row: ProjectHelpArrType) => row.data || "-",
            sortable: true,
        },
        {
            key: "tag",
            name: "Project Tag",
            selector: (row: ProjectHelpArrType) => row?.tag || "-",
            render: (row: ProjectHelpArrType) => row.tag || "-",
            sortable: true,
        },
        // {
        //     key: "createdAt",
        //     name: "Created At",
        //     selector: (row: ProjectHelpArrType) => convertDate(row?.createdAt as string) || "-",
        //     render: (row: ProjectHelpArrType) => convertDate(row.createdAt as string) || "-",
        //     sortable: true,
        // },
        // {
        //     key: "updatedAt",
        //     name: "Updated At",
        //     selector: (row: ProjectHelpArrType) => convertDate(row?.updatedAt as string) || "-",
        //     render: (row: ProjectHelpArrType) => convertDate(row.updatedAt as string) || "-",
        //     sortable: true,
        // },
    ];

    const handleEdit = (row: ProjectHelpArrType): void => {
        navigate(`/projectHelp/update/${row?.code}/true`);
    };

    const handleDelete = async (row: ProjectHelpArrType): Promise<void> => {
        try {
            // console.log("delete id: ", row.code);

            dispatch(deleteProjectHelp(row.code));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete logo");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={projectHelps as ProjectHelpArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="Project Help List"
                searchable={false}
                isAddPaginateBtn={true}
                buttonText="Add New Project Help"
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/projectHelp/add");
                }}
            // filteredDropdownForImages={true}
            />
        </>
    );
};

export default ProjectHelps;
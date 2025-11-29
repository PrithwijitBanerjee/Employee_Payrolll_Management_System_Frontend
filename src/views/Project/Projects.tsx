import React, { useEffect } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";
// import type { ProjectHelpArrType } from "@/@types/projectHelp";
// import { convertDate } from "@/utils";
import { type FormEvent } from "react";
import { deleteProject, getAllProjects } from "@/redux/Projects/projectSlice";
import type { ProjectArrType } from "@/@types/project";

const Projects: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { projects, status } = useAppSelector(state => state.project);

    useEffect(() => {
        dispatch(getAllProjects());
    }, [dispatch]);

    // Example dynamic columns
    const columns = [
        // {
        //     key: "ProjectCode",
        //     name: "Project Code",
        //     selector: (row: ProjectArrType) => row?.ProjectCode || "-",
        //     render: (row: ProjectArrType) => row.ProjectCode || "-",
        //     sortable: true,
        // },
        {
            key: "ProjectName",
            name: "Project Name",
            selector: (row: ProjectArrType) => row?.ProjectName || "-",
            render: (row: ProjectArrType) => row.ProjectName || "-",
            sortable: true,
        },
        {
            key: "SGSTRate",
            name: "SGST Rate",
            selector: (row: ProjectArrType) => row?.SGSTRate || "-",
            render: (row: ProjectArrType) => row.SGSTRate || "-",
            sortable: true,
        },
        {
            key: "CGSTRate",
            name: "CGST Rate",
            selector: (row: ProjectArrType) => row?.CGSTRate || "-",
            render: (row: ProjectArrType) => row.CGSTRate || "-",
            sortable: true,
        },
        {
            key: "IGSTRate",
            name: "IGST Rate",
            selector: (row: ProjectArrType) => row?.IGSTRate || "-",
            render: (row: ProjectArrType) => row.IGSTRate || "-",
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

    const handleEdit = (row: ProjectArrType): void => {
        navigate(`/project/update/${row?.ProjectCode}/true`);
    };

    const handleDelete = async (row: ProjectArrType): Promise<void> => {
        try {
            // console.log("delete id: ", row.code);

            dispatch(deleteProject(row.ProjectCode)).then(() => {
                dispatch(getAllProjects());
            });
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete logo");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={projects as ProjectArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="All Project List"
                searchable={false}
                isAddPaginateBtn={true}
                buttonText="Add New Project"
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/project/add");
                }}
            // filteredDropdownForImages={true}
            />
        </>
    );
};

export default Projects;
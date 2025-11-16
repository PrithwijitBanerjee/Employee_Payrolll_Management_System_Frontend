import React, { useEffect, type FormEvent } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";
import { deleteDepartment, getAllDepartments } from "@/redux/Departments/departmentSlice";
import type { DepartmentArrType } from "@/@types/department";
// import { convertDate } from "@/utils";

const Departments: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { departments, status } = useAppSelector(state => state.department);

    useEffect(() => {
        dispatch(getAllDepartments());
    }, [dispatch]);

    // Example dynamic columns
    const columns = [
        // {
        //     key: "SL.NO.",
        //     name: "SL.NO.",
        //     selector: (_: DepartmentArrType, index: number) => index + 1,
        //     render: (_: DepartmentArrType, index: number) => index + 1,
        //     sortable: true, // Disable sorting for serial numbers
        // },
        // {
        //     key: "DeptCode",
        //     name: "Deptartment Code",
        //     selector: (_: DepartmentArrType) => _.DeptCode,
        //     render: (_: DepartmentArrType) => _.DeptCode,
        //     sortable: false, // Disable sorting for serial numbers
        // },
        {
            key: "DeptName",
            name: "Department Name",
            selector: (row: DepartmentArrType) => row?.DeptName || "-",
            render: (row: DepartmentArrType) => row.DeptName || "-",
            sortable: true,
        },
        {
            key: "DeptStatus",
            name: "Department Status",
            selector: (row: DepartmentArrType) => row?.status?.data || "-",
            render: (row: DepartmentArrType) => row.status?.data || "-",
            sortable: true,
        },
        // {
        //     key: "createdAt",
        //     name: "Created At",
        //     selector: (row: DepartmentArrType) => convertDate(row?.createdAt as string) || "-",
        //     render: (row: DepartmentArrType) => convertDate(row.createdAt as string) || "-",
        //     sortable: true,
        // },
        // {
        //     key: "updatedAt",
        //     name: "Updated At",
        //     selector: (row: DepartmentArrType) => convertDate(row?.updatedAt as string) || "-",
        //     render: (row: DepartmentArrType) => convertDate(row.updatedAt as string) || "-",
        //     sortable: true,
        // },
    ];

    const handleEdit = (row: DepartmentArrType): void => {
        navigate(`/department/update/${row?.DeptCode}/true`);
    };

    const handleDelete = async (row: DepartmentArrType): Promise<void> => {
        try {
            // console.log("delete id: ", row.DeptCode);

            dispatch(deleteDepartment(row.DeptCode)).then(() => dispatch(getAllDepartments()));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete department");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={departments as DepartmentArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="Department List"
                searchable={false}
                buttonText={"Add New Department"}
                isAddPaginateBtn={true}
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/department/add");
                }}
            // filteredDropdownForImages={true}
            />
        </>
    );
};

export default Departments;
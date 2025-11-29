import React, { useEffect, useState, type FormEvent } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";
// import type { DepartmentArrType } from "@/@types/department";
// import { convertDate } from "@/utils";
import type { EmployeeArrType } from "@/@types/employee";
import { deleteEmployee, getAllEmployees } from "@/redux/Employees/employeeSlice";
// import EyeIcon from "@/components/commons/EyeIcon";
import DetailShowModal from "@/components/modals/DetailShowModal";

const Employees: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { employees, status } = useAppSelector(state => state.employee);
    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

    const [isModalOpenDesg, setIsModalOpenDesg] = useState(false);
    const [selectedDesg, setSelectedDesg] = useState<any>(null);

    // State for status filter
    const [statusFilter, setStatusFilter] = useState<string>("Active");

    // Close modal
    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setSelectedDepartment(null);
    };

    // Close modal
    const handleCloseModalDesg = (): void => {
        setIsModalOpenDesg(false);
        setSelectedDesg(null);
    };

    useEffect(() => {
        dispatch(getAllEmployees());
    }, [dispatch]);

    // Filter employees based on status
    const filteredEmployees = employees.filter((employee: EmployeeArrType) => {
        if (statusFilter === "Active") {
            return employee.status?.data === "Active";
        } else if (statusFilter === "Inactive") {
            return employee.status?.data === "Inactive";
        }
        return true; // Show all if "All" is selected
    });

    // Example dynamic columns
    const columns = [
        // {
        //     key: "EmplCode",
        //     name: "Employee Code",
        //     selector: (_: EmployeeArrType) => _.EmplCode,
        //     render: (_: EmployeeArrType) => _.EmplCode,
        //     sortable: false, // Disable sorting for serial numbers
        // },
        {
            key: "EmplName",
            name: "Employee Name",
            selector: (row: EmployeeArrType) => row?.EmplName || "-",
            render: (row: EmployeeArrType) => row.EmplName || "-",
            sortable: true,
        },
        {
            key: "EmplTag",
            name: "Employee Tag",
            selector: (row: EmployeeArrType) => row?.EmplTag || "-",
            render: (row: EmployeeArrType) => row.EmplTag || "-",
            sortable: true,
        },
        // {
        //     key: "DOJ",
        //     name: "Date Of Joining",
        //     selector: (row: EmployeeArrType) => row?.DOJ || "-",
        //     render: (row: EmployeeArrType) => row?.DOJ || "-",
        //     sortable: true,
        // },
        {
            key: "type",
            name: "Employee Type",
            selector: (row: EmployeeArrType) => row?.type?.data || "-",
            render: (row: EmployeeArrType) => row.type?.data || "-",
            sortable: true,
        },
        {
            key: "department",
            name: "Department",
            selector: (row: EmployeeArrType) => row?.department?.DeptName || "-",
            render: (row: EmployeeArrType) => row?.department?.DeptName || "-",
            sortable: true,
        },
        {
            key: "designation",
            name: "Designation",
            selector: (row: EmployeeArrType) => row?.designation?.DesgName || "-",
            render: (row: EmployeeArrType) => row?.designation?.DesgName || "-",
            sortable: true,
        },
        // {
        //     key: "DOB",
        //     name: "Date Of Birth",
        //     selector: (row: EmployeeArrType) => row?.DOB || "-",
        //     render: (row: EmployeeArrType) => row?.DOB || "-",
        //     sortable: true,
        // },
        {
            key: "UserID",
            name: "User Id",
            selector: (row: EmployeeArrType) => row?.UserID || "-",
            render: (row: EmployeeArrType) => row?.UserID || "-",
            sortable: true,
        },
        // {
        //     key: "status",
        //     name: "Employee Status",
        //     selector: (row: EmployeeArrType) => row?.status?.data || "-",
        //     render: (row: EmployeeArrType) => row.status?.data || "-",
        //     sortable: true,
        // },
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

    const handleEdit = (row: EmployeeArrType): void => {
        navigate(`/employee/update/${row?.EmplCode}/true`);
    };

    const handleDelete = async (row: EmployeeArrType): Promise<void> => {
        try {
            // console.log("delete id: ", row.DeptCode);

            dispatch(deleteEmployee(row.EmplCode)).then(() => dispatch(getAllEmployees()));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete employee");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={filteredEmployees as EmployeeArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="Employee List"
                searchable={false}
                buttonText={"Add New Employee"}
                isAddPaginateBtn={true}
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/employee/add");
                }}
                // Add filter dropdown props
                showStatusFilter={true}
                statusFilterValue={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            <DetailShowModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                department={selectedDepartment}
                text="Department"

            />

            <DetailShowModal
                isOpen={isModalOpenDesg}
                onClose={handleCloseModalDesg}
                department={selectedDesg}
                text="Designation"
            />
        </>
    );
};

export default Employees;
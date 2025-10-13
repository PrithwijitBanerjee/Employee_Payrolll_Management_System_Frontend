import React, { useEffect, type FormEvent } from "react";
import DataGrid from "../DataGrid/DataGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { RoleArrType } from "@/@types/role";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { deleteRole, getAllRoles } from "@/redux/Roles/roleSlice";
import Loader from "@/components/commons/Loader";
import { STATUES } from "@/utils/Status";

const Roles: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { roles, status } = useAppSelector(state => state.role);

    useEffect(() => {
        dispatch(getAllRoles());
    }, [dispatch]);

    // Example dynamic columns
    const columns = [
        {
            key: "id",
            name: "ID",
            selector: (_: RoleArrType, index: number) => index + 1,
            render: (_: RoleArrType, index: number) => index + 1,
            sortable: false, // Disable sorting for serial numbers
        },
        {
            key: "roleName",
            name: "Role Name",
            selector: (row: RoleArrType) => row?.roleName,
            render: (row: RoleArrType) => row.roleName,
            sortable: true,
        },
    ];

    const handleEdit = (row: RoleArrType): void => {
        navigate(`/role/update/${row?.id}/true`);
    };

    const handleDelete = async (row: RoleArrType): Promise<void> => {
        try {
            // console.log("delete code: ", row.code);

            dispatch(deleteRole(row.code));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete role");
        }
    };

    return (
        <>
            {status === STATUES.LOADING && <Loader />}
            <DataGrid
                columns={columns as []}
                data={roles as RoleArrType[]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title="Role List"
                searchable={false}
                isAddPaginateBtn={true}
                buttonText="Add New Role"
                paginateBtnHnadler={(e: FormEvent) => {
                    e.preventDefault();
                    navigate("/role/add");
                }}
            // filteredDropdownForImages={true}
            />
        </>
    );
};

export default Roles;
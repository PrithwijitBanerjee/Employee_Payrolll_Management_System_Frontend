import type { RoleInputType } from "@/@types/role";
import Loader from "@/components/commons/Loader";
import { addRole, getRoleById, updateRole } from "@/redux/Roles/roleSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

const INITIAL_FORM_DATA: RoleInputType = {
    role: "",
}

const RoleForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<RoleInputType>(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { status, role: roleData } = useAppSelector(state => state?.role);

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getRoleById(id)).then(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id, dispatch]);

    useEffect(() => {
        if (isEdit && roleData) {
            setFormData({
                role: (roleData as RoleInputType)?.roleName ?? "",
            } as RoleInputType);
        }
    }, [isEdit, roleData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData(prev => ({
            ...prev,
            role: e.target.value,
        }));
    };

    // Submit Logo
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();

            if (!formData.role) {
                toast.error("Please Enter Role Name");
                return;
            }
            dispatch(addRole(formData));

            // Reset formData
            setFormData(INITIAL_FORM_DATA);

        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    // Edit Logo
    const handleEdit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();

            if (!id) {
                toast.error("Invalid Role ID");
                return;
            }

            dispatch(updateRole({
                id,
                role: formData?.role || "",
            }));
            navigate("/role/view");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    const handleSearch = (e: FormEvent): void => {
        e.preventDefault();
        navigate("/role/view");
    };

    return (
        <div className='d-flex justify-content-center'>
            {status === STATUES.LOADING && <Loader />}
            {loading && <Loader />}
            <div className='form-header mx-2'>
                <section className="piechartsBox_area">
                    {!isEdit ? (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: '20px' }}>
                                User Role
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/* Category Dropdown */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Role Name</label>
                                        <input
                                            type="text"
                                            id="image"
                                            name="image"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5' style={{
                                    gap: 10
                                }}>
                                    <button type='submit' className='btn btn-outline-primary w-25'>
                                        Add Role
                                    </button>
                                    <button type='button' className='btn btn-outline-danger w-25' onClick={handleSearch}>
                                        Search
                                    </button>
                                    <button type='button' className='btn btn-outline-secondary w-25' onClick={(e) => {
                                        e.preventDefault();
                                        setFormData(INITIAL_FORM_DATA);
                                    }}>
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                User Role
                            </h4>
                            <form onSubmit={handleEdit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/* Category Dropdown */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Role Name</label>
                                        <input
                                            type="text"
                                            id="image"
                                            name="image"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5'>
                                    <button type='submit' className='btn btn-outline-success w-25'>
                                        Update Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default RoleForm;
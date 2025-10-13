import type { DepartmentType } from "@/@types/department";
import Loader from "@/components/commons/Loader";
import { addDepartment, getDepartmentById, updateDepartment } from "@/redux/Departments/departmentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import { getProjectHelpByTag } from "../../redux/ProjectHelp/projectHelpSlice";
import type { ProjectHelpArrType } from "@/@types/projectHelp";

const INITIAL_FORM_DATA: DepartmentType = {
    DeptName: "",
    DeptStatus: "",
};

const DepartmentForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<DepartmentType>(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { projectHelps } = useAppSelector(state => state?.projectHelp);
    const { status, department } = useAppSelector(state => state?.department);

    useEffect(() => {
        dispatch(getProjectHelpByTag("01"));
    }, [dispatch]);

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getDepartmentById(id)).then(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id]);

    useEffect(() => {
        if (isEdit && department) {
            setFormData({
                DeptName: (department as DepartmentType)?.DeptName ?? "",
                DeptStatus: (department as DepartmentType)?.DeptStatus ?? "",
            } as DepartmentType);
        }
    }, [isEdit, department]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Submit Logo
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();

            if (!formData.DeptName) {
                toast.error("Please Enter Department Name");
                return;
            }
            if (!formData.DeptStatus) {
                toast.error("Please Department Status");
                return;
            }
            dispatch(addDepartment(formData));

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
            if (!formData.DeptName) {
                toast.error("Invalid Department Name");
                return;
            }
            if (!formData.DeptStatus) {
                toast.error("Invalid Department Status");
                return;
            }

            dispatch(updateDepartment({
                id,
                DeptName: formData.DeptName,
                DeptStatus: formData.DeptStatus,
            }));
            setFormData(INITIAL_FORM_DATA);
            navigate("/department/view");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    return (
        <div className='d-flex justify-content-end'>
            {status === STATUES.LOADING && <Loader />}
            {loading && <Loader />}
            <div className='form-header mx-2'>
                <section className="piechartsBox_area">
                    {!isEdit ? (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Add Department
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Department Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Department Name</label>
                                        <input
                                            type="text"
                                            id="DeptName"
                                            name="DeptName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DeptName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Department Status</label>
                                        <select
                                            id="DeptStatus"
                                            name="DeptStatus"
                                            className="form-control"
                                            value={formData.DeptStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select department status</option>
                                            {
                                                projectHelps?.length > 0 ? projectHelps?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5' style={{
                                    gap: 10,
                                }}>
                                    <button type='submit' className='btn btn-outline-primary w-25'>
                                        Add Department
                                    </button>
                                    <button type='button' className='btn btn-outline-danger w-25' onClick={(() => navigate("/department/view"))}>
                                        Search
                                    </button>
                                    <button type='button' className='btn btn-outline-secondary w-25' onClick={(() => setFormData(INITIAL_FORM_DATA))}>
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Update Department
                            </h4>
                            <form onSubmit={handleEdit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Department Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Department Name</label>
                                        <input
                                            type="text"
                                            id="DeptName"
                                            name="DeptName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DeptName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Department Status</label>
                                        <select
                                            id="DeptStatus"
                                            name="DeptStatus"
                                            className="form-control"
                                            value={formData.DeptStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select department status</option>
                                            {
                                                projectHelps?.length > 0 ? projectHelps?.map((item: ProjectHelpArrType) => (
                                                    <option key={item.code} value={item.code}>{item.data}</option>
                                                )) : (<option value={""} disabled={true}>No data found ...</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5'>
                                    <button type='submit' className='btn btn-outline-success w-25'>
                                        Update Department
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

export default DepartmentForm;
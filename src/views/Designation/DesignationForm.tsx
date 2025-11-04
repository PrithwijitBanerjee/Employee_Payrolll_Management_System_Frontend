import Loader from "@/components/commons/Loader";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import { getProjectHelpByTag } from "../../redux/ProjectHelp/projectHelpSlice";
import type { ProjectHelpArrType } from "@/@types/projectHelp";
import type { DesignationInpType } from "@/@types/designation";
import { addDesignation, updateDesignation } from "@/redux/Designations/designationSlice";
import { getDesignationById } from "../../redux/Designations/designationSlice";

const INITIAL_FORM_DATA: DesignationInpType = {
    DesgName: "",
    DesgStatus: "",
};

const DesignationForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<DesignationInpType>(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { projectHelps } = useAppSelector(state => state?.projectHelp);
    const { status, designation } = useAppSelector(state => state?.designation);

    useEffect(() => {
        dispatch(getProjectHelpByTag("01"));
    }, [dispatch]);

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getDesignationById(id)).then(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id, dispatch]);

    useEffect(() => {
        if (isEdit && designation) {
            setFormData({
                DesgName: (designation as DesignationInpType)?.DesgName ?? "",
                DesgStatus: (designation as DesignationInpType)?.DesgStatus ?? "",
            } as DesignationInpType);
        }
    }, [isEdit, designation]);

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

            if (!formData.DesgName) {
                toast.error("Please Enter Designation Name");
                return;
            }
            if (!formData.DesgStatus) {
                toast.error("Please Enter Designation Status");
                return;
            }
            dispatch(addDesignation(formData));

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
            if (!formData.DesgName) {
                toast.error("Invalid Designation Name");
                return;
            }
            if (!formData.DesgStatus) {
                toast.error("Invalid Designation Status");
                return;
            }

            dispatch(updateDesignation({
                id,
                DesgName: formData.DesgName,
                DesgStatus: formData.DesgStatus,
            }));
            setFormData(INITIAL_FORM_DATA);
            navigate("/designation/view");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    return (
        <div className='d-flex justify-content-center'>
            {status === STATUES.LOADING && <Loader />}
            {loading && <Loader />}
            <div className='form-header mx-2'>
                <section className="piechartsBox_area">
                    {!isEdit ? (
                        <div>
                            <h4 className='text-center' style={{ marginBottom: "20px" }}>
                                Add Designation
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Designation Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Designation Name</label>
                                        <input
                                            type="text"
                                            id="DesgName"
                                            name="DesgName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DesgName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Designation Status</label>
                                        <select
                                            id="DesgStatus"
                                            name="DesgStatus"
                                            className="form-control"
                                            value={formData.DesgStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select designation status</option>
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
                                        Add Designation
                                    </button>
                                    <button type='button' className='btn btn-outline-danger w-25' onClick={(() => navigate("/designation/view"))}>
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
                                    {/*  Designation Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Designation Name</label>
                                        <input
                                            type="text"
                                            id="DesgName"
                                            name="DesgName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.DesgName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Designation Status</label>
                                        <select
                                            id="DesgStatus"
                                            name="DesgStatus"
                                            className="form-control"
                                            value={formData.DesgStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select designation status</option>
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
                                        Update Designation
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

export default DesignationForm;
import type { ProjectHelpInpType } from "@/@types/projectHelp";
import Loader from "@/components/commons/Loader";
import { addProjectHelp, getProjectHelpById, updateProjectHelp } from "@/redux/ProjectHelp/projectHelpSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

const INITIAL_FORM_DATA: ProjectHelpInpType = {
    data: "",
    tag: "",
};

const ProjectHelpForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<ProjectHelpInpType>(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { status, projectHelp } = useAppSelector(state => state?.projectHelp);

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getProjectHelpById(id)).then(() => {
                setLoading(false);
            });
        }
    }, [isEdit, id, dispatch]);

    useEffect(() => {
        if (isEdit && projectHelp) {
            setFormData({
                data: (projectHelp as ProjectHelpInpType)?.data ?? "",
                tag: (projectHelp as ProjectHelpInpType)?.tag ?? "",
            } as ProjectHelpInpType);
        }
    }, [isEdit, projectHelp]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Submit Logo
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();

            if (!formData.data) {
                toast.error("Please Enter Data");
                return;
            }
            if (!formData.tag) {
                toast.error("Please Enter tag");
                return;
            }
            dispatch(addProjectHelp(formData));

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
            if (!formData.data) {
                toast.error("Invalid Data");
                return;
            }
            if (!formData.tag) {
                toast.error("Invalid tag");
                return;
            }

            dispatch(updateProjectHelp({
                id,
                data: formData.data,
                tag: formData.tag,
            }));
            setFormData(INITIAL_FORM_DATA);
            navigate("/projectHelp/view");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!!!");
        }
    };

    const handleSearch = (e: FormEvent) => {
         e.preventDefault();
         navigate("/projectHelp/view");
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
                                Project Help
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Data */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Data</label>
                                        <input
                                            type="text"
                                            id="image"
                                            name="data"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.data}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Tag</label>
                                        <input
                                            type="text"
                                            id="image"
                                            name="tag"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.tag}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5' style={{
                                    gap: 10
                                }}>
                                    <button type='submit' className='btn btn-outline-primary w-25'>
                                        Add Project Help
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
                                Project Help
                            </h4>
                            <form onSubmit={handleEdit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Data */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Data</label>
                                        <input
                                            type="text"
                                            id="image"
                                            name="data"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.data}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Tag</label>
                                        <input
                                            type="text"
                                            id="image"
                                            name="tag"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.tag}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-5'>
                                    <button type='submit' className='btn btn-outline-success w-25'>
                                        Update Project Help
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

export default ProjectHelpForm;
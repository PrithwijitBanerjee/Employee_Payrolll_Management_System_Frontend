import Loader from "@/components/commons/Loader";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { STATUES } from "@/utils/Status";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectHelpByTag } from "../../redux/ProjectHelp/projectHelpSlice";
import type { ProjectHelpArrType } from "@/@types/projectHelp";
import type { ClientInpType } from "@/@types/client";
import { addClient, getClientById, updateClient } from "@/redux/Clients/clientSlice";

const INITIAL_FORM_DATA: ClientInpType = {
    ClientName: "",
    ClientStatus: "",
};

const ClientForm = () => {
    const navigate = useNavigate();
    const { isEdit, id } = useParams<{ isEdit?: string; id?: string }>();

    const [formData, setFormData] = useState<ClientInpType>(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { projectHelps } = useAppSelector(state => state?.projectHelp);
    const { status, client } = useAppSelector(state => state?.client);

    useEffect(() => {
        dispatch(getProjectHelpByTag("01"));
    }, [dispatch]);

    // Reset form function
    const resetForm = (): void => {
        setFormData(INITIAL_FORM_DATA);
    };

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            dispatch(getClientById(id)).then(() => {
                setLoading(false);
            });
        } else {
            // Clear form when not in edit mode
            resetForm();
        }
    }, [isEdit, id]);

    useEffect(() => {
        if (isEdit && client) {
            setFormData({
                ClientName: (client as ClientInpType)?.ClientName ?? "",
                ClientStatus: (client as ClientInpType)?.ClientStatus ?? "",
            } as ClientInpType);
        }
    }, [client, isEdit]);

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

            if (!formData.ClientName) {
                toast.error("Please Enter Client Name");
                return;
            }
            if (!formData.ClientStatus) {
                toast.error("Please Enter Client Status");
                return;
            }

            // Dispatch and wait for the action to complete
            await dispatch(addClient(formData));

            // Reset formData
            resetForm();

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
            if (!formData.ClientName) {
                toast.error("Invalid Client Name");
                return;
            }
            if (!formData.ClientStatus) {
                toast.error("Invalid Client Status");
                return;
            }

            // Dispatch and wait for the action to complete
            await dispatch(updateClient({
                id,
                ClientName: formData.ClientName,
                ClientStatus: formData.ClientStatus,
            }));

            // Reset form after successful update
            resetForm();

            navigate("/client/view");
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
                                Client
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Client Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Client Name</label>
                                        <input
                                            type="text"
                                            id="ClientName"
                                            name="ClientName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.ClientName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Client Status</label>
                                        <select
                                            id="ClientStatus"
                                            name="ClientStatus"
                                            className="form-control"
                                            value={formData.ClientStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select client status</option>
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
                                        Add Client
                                    </button>
                                    <button type='button' className='btn btn-outline-danger w-25' onClick={(() => navigate("/client/view"))}>
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
                                Client
                            </h4>
                            <form onSubmit={handleEdit}>
                                <div className='p-2' style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
                                    {/*  Client Name */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Client Name</label>
                                        <input
                                            type="text"
                                            id="ClientName"
                                            name="ClientName"
                                            className="form-control"
                                            accept="image/*"
                                            value={formData.ClientName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    {/*  Tag */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="category">Client Status</label>
                                        <select
                                            id="ClientStatus"
                                            name="ClientStatus"
                                            className="form-control"
                                            value={formData.ClientStatus}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={""} disabled={true}>select client status</option>
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
                                        Update Client
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

export default ClientForm;
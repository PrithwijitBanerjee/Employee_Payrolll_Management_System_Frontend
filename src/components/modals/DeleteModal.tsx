import React, { useState } from "react";
import styles from "@/components/modals/DeleteModal.module.css";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    itemId?: string | number;
    itemName?: string;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemId,
    itemName = 'item'
}) => {
    const [confirmationText, setConfirmationText] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleConfirm = async (): Promise<void> => {
        if (confirmationText.toLowerCase() !== 'delete') {
            return;
        }

        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
            setConfirmationText('');
        } catch (error) {
            // Handle error if needed
            console.error('Error during deletion:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirmationText(e.target.value);
    };

    const isConfirmDisabled = confirmationText.toLowerCase() !== 'delete' || isDeleting;

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Confirm Deletion</h3>
                    <button 
                        onClick={onClose} 
                        className={styles.closeButton}
                        disabled={isDeleting}
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.body}>
                    <p className={styles.message}>
                       {
                        itemName &&  <>Are you sure you want to delete <strong>{itemName}</strong></>
                       }
                        {itemId && <> (ID: {itemId})</>}?
                        This action cannot be undone.
                    </p>

                    <p className={styles.instruction}>
                        Type <strong>"delete"</strong> in the box below to confirm:
                    </p>

                    <input
                        type="text"
                        className={styles.input}
                        value={confirmationText}
                        onChange={handleInputChange}
                        placeholder="Type 'delete' to confirm"
                        disabled={isDeleting}
                    />
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={onClose}
                        className={styles.cancelButton}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        className={`${styles.confirmButton} ${isConfirmDisabled ? styles.disabled : ''}`}
                        disabled={isConfirmDisabled}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
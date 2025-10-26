import type React from "react";
import "@/components/modals/DetailShowModal.css";

const DetailShowModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  department: any;
  text: string;
}> = ({ isOpen, onClose, department, text }) => {
  if (!isOpen || !department) return null;
  console.log("text: ", text);
  
  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="department-modal" style={{
        zIndex: 1000000
      }}>
        <div className="modal-header">
          <h2>{text} Details</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">{text} Code:</span>
            <span className="detail-value">{department.DeptCode || department.DesgCode || "-"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{text} Name:</span>
            <span className="detail-value">{department.DeptName || department.DesgName || "-"}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailShowModal;

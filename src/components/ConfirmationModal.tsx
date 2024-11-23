// src/components/ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (e: React.MouseEvent) => void;
  onCancel?: (e: React.MouseEvent) => void;
  cancel?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  cancel = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-500">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full mx-4">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end px-6 py-4 space-x-3">
          {cancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

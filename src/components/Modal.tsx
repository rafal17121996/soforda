import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      data-dialog-backdrop="dialog"
      data-dialog-backdrop-close="true"
      className="absolute left-0 top-0 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        data-dialog="dialog"
        className="relative mx-auto flex w-full max-w-[26rem] flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md"
      >
        <div className="flex flex-col p-6 pb-0">
          <h4 className="text-2xl mb-1 font-semibold text-slate-700">
            {title}
          </h4>
          <p className="mb-1  text-slate-400">{subtitle}</p>
        </div>
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

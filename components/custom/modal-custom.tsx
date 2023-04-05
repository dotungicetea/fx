import { ModalInputType } from "@/types/global-type";
import clsx from "clsx";
import { useEffect } from "react";
import ButtonCross from "./button-cross";

const Modal = ({
  children,
  isOpen,
  className,
  isNormalModal = true,
  onClose,
}: ModalInputType) => {
  useEffect(() => {
    if (document) {
      try {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [isOpen, children]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={clsx(
        "fixed flex items-top justify-center items-center top-0 left-0 z-50 p-4 overflow-x-hidden overflow-y-auto w-full h-full",
        className
      )}
    >
      <div
        className="fixed bg-black bg-opacity-80 top-0 left-0 z-0 p-4 w-full h-full"
        onClick={() => handleClose()}
      />
      {isNormalModal ? (
        <div className="relative max-w-full z-60 top-0 left-0 w-fit h-full">
          <div className="relative bg-white rounded-lg">
            <ButtonCross handleClose={handleClose} />
            <div className="px-6 pt-10 pb-6 text-center">{children}</div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export default Modal;

import { ListNftSuccessModalType } from "@/types/modal-type";
import Modal from "../custom/modal-custom";
import Image from "next/image";
import Link from "next/link";
import { pathname } from "../../constants/nav";

const ListNftSuccessModal = ({
  isOpen,
  isEdit,
  handleHideModal,
}: ListNftSuccessModalType) => {
  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div
        style={{ width: "calc(90vw - 40px)" }}
        className="md:w-[100vw] max-w-[340px] md:px-5 text-left pb-5"
      >
        <Image
          src="/images/icons/success.svg"
          className="mx-auto"
          width={60}
          height={60}
          alt="icon success"
        />
        <p className="text-[24px] leading-[33px] font-semibold text-center">
          {isEdit
            ? "Your NFT has been edited successfully."
            : "Your NFT has been listed successfully."}
        </p>
        <div className="text-center">
          <button
            className="btn-fill w-[200px] h-[40px] mt-5 rounded-[4px] text-[14px] leading-[17px] font-semibold"
            onClick={() => handleHideModal()}
          >
            View Listing
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ListNftSuccessModal;

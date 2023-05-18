import EditListingModal from "@/components/modals/edit-listing-modal";
import { EditListingType } from "@/types/my-account-type";
import { useState } from "react";

const EditListing = ({
  currentListing,
  isShowEditListing,
  currentPrice,
  address,
  nftDetail,
  reloadData,
  toast,
  setReloadData,
  setIsEditingNft,
  handleHideEditListing,
  handleShowEditListing,
}: EditListingType) => {
  const [price, setPrice] = useState<number | undefined>();

  return (
    <>
      <EditListingModal
        isOpen={isShowEditListing}
        currentPrice={currentPrice}
        currentListing={currentListing}
        price={price}
        reloadData={reloadData}
        nftDetail={nftDetail}
        address={address}
        toast={toast}
        setIsEditingNft={setIsEditingNft}
        setReloadData={setReloadData}
        handleShowModal={handleShowEditListing}
        setPrice={setPrice}
        handleHideModal={handleHideEditListing}
      />
    </>
  );
};

export default EditListing;

/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NftDetailModal from "../modals/nft-detail-modal";
import MyNftCard from "./my-cards/cards";
import SortFilter from "./my-cards/sort-filter";
import { pathname } from "@/constants/nav";
import useMediaQuery from "../hooks/media-query";
import MyCardLoading from "../loading/my-card-loading";
import {
  rarityValues,
  statusValues,
  symbolValues,
} from "@/constants/my-account";

interface Props {
  nftList: any[] | undefined;
}

const NftCards = ({ nftList }: Props) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [myNfts, setMyNfts] = useState<any[]>();
  const [listCheck, setListCheck] = useState<string[]>([]);
  const [cardIdShow, setCardIdShow] = useState<number | null>(null);

  const handleShowModal = () => setIsShowModal(true);
  const handleHideModal = () => setIsShowModal(false);

  const handleShowFilter = () => setIsShowFilter(true);
  const handleHideFilter = () => setIsShowFilter(false);

  useEffect(() => {
    setMyNfts(nftList);
  }, [nftList]);

  const handleChange = (value: any, checked: boolean) => {
    const index = listCheck.findIndex((nft: any) => nft === value);
    if (index === -1 && checked) {
      const cloneNft = [...listCheck];
      cloneNft.push(value);
      setListCheck(cloneNft);
    }
    if (index >= 0) {
      if (checked) {
        const cloneNft = [...listCheck];
        cloneNft[index] = value;
        setListCheck(cloneNft);
      } else {
        const cloneNft = [...listCheck];
        cloneNft.splice(index, 1);
        setListCheck(cloneNft);
      }
    }
  };

  const handleFilter = () => {
    if (!listCheck || !listCheck?.length) {
      setMyNfts(nftList);
      return;
    }
    const rarityChecked = listCheck?.filter((check) =>
      rarityValues.some((value) => value.toLowerCase() === check.toLowerCase())
    );
    const symbolChecked = listCheck?.filter((check) =>
      symbolValues.some((value) => value.toLowerCase() === check.toLowerCase())
    );
    const statusChecked = listCheck?.filter((check) =>
      statusValues.some((value) => value.toLowerCase() === check.toLowerCase())
    );
    let nftFilter = [...(nftList as any)];
    !!rarityChecked?.length &&
      (nftFilter = nftFilter?.filter((value) =>
        rarityChecked?.some(
          (rarity) => value?.rarity?.toLowerCase() === rarity.toLowerCase()
        )
      ));
    !!symbolChecked?.length &&
      (nftFilter = nftFilter?.filter((value) =>
        symbolChecked?.some(
          (symbol) => value?.symbol?.toLowerCase() === symbol.toLowerCase()
        )
      ));
    !!statusChecked?.length &&
      (nftFilter = nftFilter?.filter((value) =>
        statusChecked?.some(
          (status) => value?.status?.toLowerCase() === status.toLowerCase()
        )
      ));
    setMyNfts(nftFilter);
    handleHideFilter();
  };

  const handleClear = () => {
    setMyNfts(nftList);
    setListCheck([]);
    handleHideFilter();
  };

  const handleShowCard = (id: number) => {
    if (typeof id === "number") {
      setCardIdShow(id);
      handleShowModal();
    }
  };

  return (
    <div>
      {!nftList && <MyCardLoading />}
      {typeof nftList !== "undefined" && (
        <div className="lg:flex gap-5">
          {!!nftList?.length ? (
            <>
              {(isShowFilter || isDesktop) && (
                <SortFilter
                  listCheck={listCheck}
                  handleChange={handleChange}
                  handleFilter={handleFilter}
                  handleClear={handleClear}
                  handleHideFilter={handleHideFilter}
                />
              )}
              <div>
                <button
                  className="flex lg:hidden px-5 py-[12px] bg-[#002464] text-white rounded-[8px] gap-[10px] text-[14px] justify-center items-center font-semibold"
                  onClick={() => handleShowFilter()}
                >
                  <Image
                    src="/images/icons/filter_white.svg"
                    width={20}
                    height={20}
                    alt="icon filter"
                  />
                  Sort & Filters
                </button>
              </div>
              <div className="w-full h-fit flex justify-center lg:justify-start mt-5 lg:mt-0 gap-[12px] flex-wrap list-card">
                {myNfts?.map((card: any, index) => (
                  <MyNftCard
                    key={index}
                    card={card}
                    handleShowCard={handleShowCard}
                  />
                ))}
                <NftDetailModal
                  isOpen={isShowModal}
                  id={cardIdShow}
                  handleHideModal={handleHideModal}
                />
              </div>
            </>
          ) : (
            <div className="w-full py-10 text-center">
              <Image
                src="/images/icons/icon_no_record.svg"
                className="mx-auto"
                width={120}
                height={120}
                alt="no nft"
              />
              <p className="text-[28px] mt-5 font-semibold">
                Total: 0 NFT Card
              </p>
              <p>You haven&apos;t owned any NFTs yet</p>
              <div className="flex gap-2 justify-center mt-8">
                <Link href={pathname.LUCKYBOX}>
                  <button className="w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold border-[1px] border-[#002464]">
                    Buy Card NFT
                  </button>
                </Link>
                <Link href={pathname.LUCKYBOX}>
                  <button className="w-[160px] h-[40px] rounded-[4px] text-[14px] font-semibold bg-[#002464] text-white">
                    Buy Box
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NftCards;

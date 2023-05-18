/* eslint-disable react-hooks/exhaustive-deps */
import { NetworkContext } from "@/components/context/network-context";
import Tab from "@/components/global/tab";
import MarketplaceCards from "@/components/marketplace/marketplace-card";
import { pathname } from "@/constants/nav";
import { getNftInMarketplace } from "@/services/market";
import { getUserFromLocal } from "@/utils/network";
import { decryptOrder } from "@/utils/nft";
import { useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { handleSortMarket } from "@/utils/my-account";

const Marketplace = () => {
  const [tab, setTab] = useState<number>(0);
  const { address } = useAccount();
  const [nftList, setNftList] = useState<any[] | null>([]);
  const [rarityCheck, setRarityCheck] = useState<string[]>([]);
  const [typeCheck, setTypeCheck] = useState<string[]>([]);
  const [isOwnerCheck, setIsOwnerCheck] = useState<boolean>(false);
  const [filterPrices, setFilterPrices] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<any>();
  const [lastElement, setLastElement] = useState<any>(null);
  const [sort, setSort] = useState<string>("price_asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [firstView, setFirstView] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);

  const handleGetNftInMarketplace = async (user: any) => {
    if (page === 0) return;
    setLoading(true);
    try {
      const param = {
        wallet_address: address || "",
        signature: user?.signature,
        is_owner: isOwnerCheck,
        price_min: ethers.utils
          .parseEther(filterPrices?.min?.toString() || "0")
          .toString(),
        price_max: ethers.utils
          .parseEther(filterPrices?.max?.toString() || "9999999999999999999999")
          .toString(),
        rarity: rarityCheck || [],
        currency_type: typeCheck || [],
        sort_by: handleSortMarket(sort),
        page: page,
        size: 10,
      };
      const result = await getNftInMarketplace(param);

      if (result?.data?.results) {
        const dataAfterFormat = result?.data?.results?.map((data: any) => {
          const attributes: any[] = data?.order_item?.attributes
            ? JSON.parse(data?.order_item?.attributes)
            : [];
          const rarity = attributes.find((attribute: any) => {
            return attribute?.trait_type?.toLocaleLowerCase() === "rarity";
          });
          const symbol = attributes.find((attribute: any) => {
            return attribute?.trait_type?.toLocaleLowerCase() === "symbol";
          });
          const mp = attributes.find((attribute: any) => {
            return attribute?.trait_type?.toLocaleLowerCase() === "mp";
          });
          const order_parameters_obj = decryptOrder(
            data?.order_item?.order_parameters
          );
          const dataNft = {
            ...data,
            rarity: rarity?.value,
            symbol: symbol?.value,
            mp: mp.value,
            status: "mining",
            attributes: attributes,
            order_parameters_obj,
          };
          return dataNft;
        });
        setNftList([...(nftList || []), ...dataAfterFormat]);
        result?.data?.metadata && setMeta(result?.data?.metadata);
        setLoading(false);
        !firstView && setFirstView(true);
      } else {
        setNftList(null);
        setLoading(false);
        !firstView && setFirstView(true);
      }
    } catch (e) {
      setNftList(null);
      setLoading(false);
      !firstView && setFirstView(true);
    }
  };

  useEffect(() => {
    if (!firstView) return;
    setPage(1);
    setNftList([]);
    setReloadData(!reloadData);
  }, [rarityCheck, typeCheck, isOwnerCheck, filterPrices, sort]);

  useEffect(() => {
    if (!firstView) return;
    const user = getUserFromLocal();
    handleGetNftInMarketplace(user);
  }, [reloadData, address]);

  useEffect(() => {
    if (firstView) return;
    const user = getUserFromLocal();
    handleGetNftInMarketplace(user);
  }, [address]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPage((no) => no + 1);
        setReloadData(!reloadData);
      }
    });
    const currentElement = lastElement;
    if (currentElement) {
      observer.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  return (
    <div className="pt-5">
      <h1 className="text-[28px] text-center lg:text-left lg:text-[32px] leading-[38px] font-[600] px-5 xl:px-[50px]">
        NFT Currencies Marketplace
      </h1>
      <div className="px-5 lg:px-0">
        <Tab
          tabsContent={["NFT Cards"]}
          tabNumber={tab}
          isButton
          hrefButton={`${pathname.MARKETPLACE}${pathname.ACTIVITIES}`}
          className="lg:px-5 xl:px-[50px] lg:mt-3"
          lineClassName="mb-0"
          handleChangeTab={setTab}
        />
      </div>
      {tab === 0 && (
        <MarketplaceCards
          nftList={nftList}
          rarityCheck={rarityCheck}
          typeCheck={typeCheck}
          isOwnerCheck={isOwnerCheck}
          filterPrices={filterPrices}
          page={page}
          meta={meta}
          loading={loading}
          setSort={setSort}
          setLastElement={setLastElement}
          setRarityCheck={setRarityCheck}
          setTypeCheck={setTypeCheck}
          setIsOwnerCheck={setIsOwnerCheck}
          setFilterPrices={setFilterPrices}
        />
      )}
    </div>
  );
};

export default Marketplace;

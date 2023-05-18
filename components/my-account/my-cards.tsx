/* eslint-disable react-hooks/exhaustive-deps */
import { getBoxNum, getNftList } from "@/services/box-service";
import { getUserFromLocal } from "@/utils/network";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkContext } from "../context/network-context";
import Tab from "../global/tab";
import MyBoxes from "./my-boxes";
import NftCards from "./nft-cards";
import MyOffers from "./my-offers";

const MyCards = () => {
  const [tab, setTab] = useState<number>(0);
  const { address, isConnected } = useAccount();
  const [boxNum, setBoxNum] = useState<any>();
  const [nftList, setNftList] = useState<any[]>();
  const { signature } = useContext(NetworkContext);

  const handleGetNftList = async (user: any) => {
    try {
      const nfts = await getNftList({
        wallet_address: address || "",
        signature: user?.signature,
      });
      if (nfts?.data && nfts?.data?.length) {
        const dataAfterFormat = nfts?.data?.map((data: any) => {
          const attributes: any[] = data?.nft_item?.attributes
            ? JSON.parse(data?.nft_item?.attributes)
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
          const dataNft = {
            ...data?.nft_item,
            ...data?.offer_item,
            rarity: rarity?.value,
            symbol: symbol?.value,
            mp: mp.value,
            status: "mining",
            attributes: attributes,
          };
          return dataNft;
        });
        setNftList(dataAfterFormat);
      } else {
        setNftList([]);
      }
    } catch (err) {
      setNftList([]);
    }
  };

  const handleGetBoxNum = async (user: any) => {
    try {
      if (user && user?.signature && address) {
        const result = await getBoxNum({
          wallet_address: address,
          signature: user?.signature,
        });
        if (result && result?.data) {
          setBoxNum(result.data);
        }
      } else {
        setBoxNum(null);
      }
    } catch (err) {
      setBoxNum(null);
    }
  };

  useEffect(() => {
    const user = getUserFromLocal();
    handleGetBoxNum(user);
    handleGetNftList(user);
  }, [address, signature, isConnected]);

  return (
    <div className="pt-5">
      <h1 className="text-[28px] text-center lg:text-left lg:text-[32px] leading-[38px] font-[600] px-5 xl:px-[50px]">
        Collected
      </h1>
      <div className="px-5 lg:px-0">
        <Tab
          tabsContent={["NFT Cards", "My boxes", "My Offers"]}
          tabNumber={tab}
          className="lg:px-5 xl:px-[50px] lg:mt-3"
          lineClassName="mb-0"
          handleChangeTab={setTab}
        />
      </div>
      {tab === 0 && <NftCards nftList={nftList} />}
      {tab === 1 && <MyBoxes boxNum={boxNum} />}
      {tab === 2 && <MyOffers />}
    </div>
  );
};

export default MyCards;

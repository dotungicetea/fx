/* eslint-disable react-hooks/exhaustive-deps */
import { getBoxNum, getNftList } from "@/services/box-service";
import { getUserFromLocal } from "@/utils/network";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkContext } from "../context/network-context";
import Tab from "../global/tab";
import MyBoxes from "./my-boxes";
import NftCards from "./nft-cards";

const MyCards = () => {
  const [tab, setTab] = useState<number>(0);
  const { address } = useAccount();
  const [boxNum, setBoxNum] = useState<any>();
  const [nftList, setNftList] = useState<any[]>();
  const { signature } = useContext(NetworkContext);

  const handleGetNftList = async (user: any) => {
    try {
      const nfts = await getNftList({
        wallet_address: address,
        signature: user?.signature,
      });
      if (nfts?.data && nfts?.data?.length) {
        const dataAfterFormat = nfts?.data?.map((data: any) => {
          const attributes: any[] = data?.attributes
            ? JSON.parse(data?.attributes)
            : [];
          const rarity = attributes.find((attribute: any) => {
            return attribute?.trait_type === "Rarity";
          });
          const symbol = attributes.find((attribute: any) => {
            return attribute?.trait_type === "Symbol";
          });
          const dataNft = {
            ...data,
            rarity: rarity?.value,
            symbol: symbol?.value,
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
      console.error(err);
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
      console.error(err);
    }
  };

  useEffect(() => {
    const user = getUserFromLocal();
    handleGetBoxNum(user);
    handleGetNftList(user);
  }, [address, signature]);

  return (
    <div>
      <h1 className="text-[28px] text-center lg:text-left lg:text-[32px] leading-[38px] font-[600]">
        Collected
      </h1>
      <Tab
        tabsContent={["NFT Cards", "My boxes"]}
        tabNumber={tab}
        handleChangeTab={setTab}
      />
      {tab === 0 && <NftCards nftList={nftList} />}
      {tab === 1 && <MyBoxes boxNum={boxNum} />}
    </div>
  );
};

export default MyCards;

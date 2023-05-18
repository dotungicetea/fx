/* eslint-disable react-hooks/exhaustive-deps */
import {
  getBoxList,
  getBoxNum,
  getNftList,
  getTotalBoxList,
} from "@/services/box-service";
import { getUserFromLocal } from "@/utils/network";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkContext } from "../context/network-context";
import Tab from "../global/tab";
import LuckyBoxRule from "./lucky-box-rule";
import LuckyBoxStage from "./lucky-box-stage";
import LuckyBoxTypes from "./lucky-box-types";
import MyRecords from "./my-records";

const LuckyBoxPage = () => {
  const [tab, setTab] = useState<number>(0);
  const [boxList, setBoxList] = useState<any>();
  const [boxNum, setBoxNum] = useState<any>();
  const [totalBoxList, setTotalBoxList] = useState<any>();
  const { address, isConnected } = useAccount();
  const [reloadData, setReloadData] = useState<number>(0);
  const [nftList, setNftList] = useState<any[]>([]);
  const [loadingRecord, setLoadingRecord] = useState<boolean>(true);
  const { signature } = useContext(NetworkContext);

  const handleGetTotalBoxList = async () => {
    try {
      const result = await getTotalBoxList();
      if (result && result?.data) {
        setTotalBoxList(result.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleGetTotalBoxList();
  }, [reloadData]);

  const handleGetBoxList = async (user: any) => {
    try {
      if (user && user?.signature && address) {
        const result = await getBoxList({
          wallet_address: address,
          signature: user?.signature,
        });
        if (result && result?.data) {
          setBoxList(result.data);
        }
      } else {
        setBoxList([]);
      }
    } catch (err) {
      setBoxList([]);
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
        setBoxNum({});
      }
    } catch (err) {}
  };

  const handleGetNftList = async (user: any) => {
    try {
      const nfts = await getNftList({
        wallet_address: address || "",
        signature: user?.signature,
      });
      if (nfts?.data && nfts?.data?.length) {
        const listData = nfts?.data as any[];
        const nftListData = [] as any[];
        listData?.forEach((data: any) => {
          const indexTimeExist = nftListData?.findIndex((dataExist: any) => {
            return dataExist[0]?.updated_at === data?.nft_item?.updated_at;
          });
          if (indexTimeExist >= 0) {
            nftListData[indexTimeExist].push(data?.nft_item);
          } else {
            nftListData.push([data?.nft_item]);
          }
        });
        setNftList(nftListData);
        setLoadingRecord(false);
      } else {
        setNftList([]);
        setLoadingRecord(false);
      }
    } catch (err) {
      setNftList([]);
      setLoadingRecord(false);
    }
  };

  useEffect(() => {
    const user = getUserFromLocal();
    if (user && address) {
      handleGetBoxList(user);
      handleGetBoxNum(user);
      handleGetNftList(user);
    } else {
      setBoxList([]);
    }
  }, [address, reloadData, isConnected, signature]);

  return (
    <div className="px-5 xl:px-10 pb-5 pt-4">
      <div className="lg:grid lg:grid-cols-2 md:gap-3 xl:gap-[28px]">
        <LuckyBoxTypes />
        <LuckyBoxStage
          boxList={boxList}
          setBoxList={setBoxList}
          boxNum={boxNum}
          reloadData={reloadData}
          setReloadData={setReloadData}
          totalBoxList={totalBoxList}
        />
      </div>
      <Tab
        lineClassName="mb-5"
        tabsContent={["Lucky Box Rules", "My Records"]}
        tabNumber={tab}
        handleChangeTab={setTab}
      />
      {tab === 0 && <LuckyBoxRule />}
      {tab === 1 && <MyRecords myNftList={nftList} loading={loadingRecord} />}
    </div>
  );
};

export default LuckyBoxPage;

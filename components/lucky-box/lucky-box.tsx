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
  const { signature } = useContext(NetworkContext);

  const handleGetTotalBoxList = async () => {
    try {
      const result = await getTotalBoxList();
      if (result && result?.data) {
        setTotalBoxList(result.data);
      }
    } catch (err) {
      console.error(err);
    }
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
      }
      // else {
      //   setBoxList([]);
      // }
    } catch (err) {
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
        setBoxNum({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetNftList = async (user: any) => {
    try {
      const nfts = await getNftList({
        wallet_address: address,
        signature: user?.signature,
      });
      if (nfts?.data && nfts?.data?.length) {
        const listData = nfts?.data as any[];
        const nftListData = [] as any[];
        listData?.forEach((data: any) => {
          const indexTimeExist = nftListData?.findIndex((dataExist: any) => {
            return dataExist[0]?.updated_at === data?.updated_at;
          });
          if (indexTimeExist >= 0) {
            nftListData[indexTimeExist].push(data);
          } else {
            nftListData.push([data]);
          }
        });
        setNftList(nftListData);
      } else {
        setNftList([]);
      }
    } catch (err) {
      setNftList([]);
      console.error(err);
    }
  };

  useEffect(() => {
    const user = getUserFromLocal();
    handleGetBoxList(user);
    handleGetBoxNum(user);
    handleGetNftList(user);
  }, [address, reloadData, isConnected, signature]);

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2 md:gap-3 xl:gap-[28px]">
        <LuckyBoxTypes />
        <LuckyBoxStage
          boxList={boxList}
          boxNum={boxNum}
          reloadData={reloadData}
          setReloadData={setReloadData}
          totalBoxList={totalBoxList}
        />
      </div>
      <Tab
        tabsContent={["Lucky Box Rules", "My Records"]}
        tabNumber={tab}
        handleChangeTab={setTab}
      />
      {tab === 0 && <LuckyBoxRule />}
      {tab === 1 && <MyRecords myNftList={nftList} />}
    </div>
  );
};

export default LuckyBoxPage;

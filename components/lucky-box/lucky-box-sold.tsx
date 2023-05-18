/* eslint-disable react-hooks/exhaustive-deps */
import useContract, { FX_BOX_CONTRACT } from "@/hooks/use-contract";
import { openBox } from "@/services/box-service";
import { getBoxesText } from "@/utils";
import { getUserFromLocal, wei2ether, wei2Number } from "@/utils/network";
import { ethers } from "ethers";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ToastContext } from "../context/toast-context";
import BuyBoxModal from "../modals/buy-box-modal";
import OpenBoxModal from "../modals/open-box-modal";
import BoxBuyOpen from "./box-buy-open";
import { toastType } from "@/constants/context";
import { LuckyBoxSoldType } from "@/types/lucky-box";

const LuckyBoxSold = ({
  boxSold,
  totalBox,
  reloadData,
  setReloadData,
  boxNum,
  isAllBoxSold,
  nextStage,
  boxList,
  setBoxList,
}: LuckyBoxSoldType) => {
  const [isShowModalBuy, setIsShowModalBuy] = useState<boolean>(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState<boolean>(false);
  const [numberBoxBuy, setNumberBoxBuy] = useState<number>(0);
  const [loadingBoxBuy, setLoadingBoxBuy] = useState<boolean>(false);
  const [numberBoxOpen, setNumberBoxOpen] = useState<number>(0);
  const [loadingBoxOpen, setLoadingBoxOpen] = useState<boolean>(false);
  const { fxBoxContract, busdContract } = useContract();
  const [boxsOpen, setBoxsOpen] = useState<any>([]);
  const { address } = useAccount();
  const { toast } = useContext(ToastContext);
  const [boxesBuy, setBoxBuy] = useState<any>({
    price: 90,
    token: "bsc",
    sylbol: "$BUSD",
  });

  const boxesOpen = {
    purchased: boxNum?.total ? Number(boxNum?.total) : 0,
    opened: boxNum?.opened ? Number(boxNum?.opened) : 0,
  };

  const handleShowModalBuy = () => setIsShowModalBuy(true);
  const handleHideModalBuy = () => setIsShowModalBuy(false);

  const handleShowModalOpen = () => setIsShowModalOpen(true);
  const handleHideModalOpen = () => setIsShowModalOpen(false);

  const boxSoldWidth = useMemo(() => {
    const boxSoldPercent = (boxSold / totalBox) * 100;
    if (boxSoldPercent <= 0) return 0;
    if (boxSoldPercent >= 100) return 100;
    if (boxSoldPercent <= 5) return 5;
    return boxSoldPercent;
  }, [boxSold, totalBox]);

  const handleChangeNumberBoxBuy = (num: number) => setNumberBoxBuy(num);
  const handleChangeNumberBoxOpen = (num: number) => setNumberBoxOpen(num);

  const _handleApprove = async () => {
    try {
      const gasEstimated = await busdContract?.estimateGas.approve(
        FX_BOX_CONTRACT,
        ethers.utils.parseEther(wei2ether(ethers?.constants?.MaxUint256))
      );

      const tx = await busdContract?.approve(
        FX_BOX_CONTRACT,
        ethers.utils.parseEther(wei2ether(ethers?.constants?.MaxUint256)),
        {
          gasLimit: gasEstimated,
        }
      );
      const txr = await tx?.wait();
      if (txr) {
        return true;
      }
      return false;
    } catch (e: any) {
      return false;
    }
  };

  const handleGetPrice = async () => {
    try {
      const price = await fxBoxContract?.price();
      const priceNumber = price ? Number(wei2Number(price)) : null;
      const boxInfo = {
        price: priceNumber,
        token: "bsc",
        sylbol: "$BUSD",
      };
      setBoxBuy(boxInfo);
    } catch (e) {
      toast(`Error when get box price`, "error");
    }
  };

  useEffect(() => {
    fxBoxContract && handleGetPrice();
  }, [fxBoxContract]);

  const _buyBox = async () => {
    const allowance =
      address && (await busdContract?.allowance(address, FX_BOX_CONTRACT));
    const allowanceNumber = allowance ? Number(wei2Number(allowance)) : 0;
    const boxesPrice = boxesBuy.price
      ? boxesBuy.price * (numberBoxBuy >= 0 ? numberBoxBuy : 0)
      : 0;
    let isApprove =
      allowanceNumber > boxesPrice ? true : await _handleApprove();
    if (isApprove) {
      const numberBoxBigNum = ethers?.BigNumber?.from(numberBoxBuy);
      let tx = await fxBoxContract?.buyBox(numberBoxBigNum);
      return await tx?.wait();
    }
  };

  const handleBuyBox = async () => {
    try {
      if (!address) return;
      setLoadingBoxBuy(true);
      const balance = await busdContract?.balanceOf(address);
      const balanceNumber = balance ? wei2Number(balance) : "0";
      const balanceAmount = balanceNumber ? Number(balanceNumber) : 0;
      const boxBuyPrice = boxesBuy?.price * numberBoxBuy;
      if (boxBuyPrice > balanceAmount) {
        handleHideModalBuy();
        setLoadingBoxBuy(false);
        toast(
          `Insufficient wallet balance to buy boxes. Please try again.`,
          "error"
        );
        return;
      }
      let tx = await _buyBox();
      if (tx) {
        handleHideModalBuy();
        handleChangeNumberBoxBuy(0);
        setReloadData(reloadData + 1);
        setBoxList(undefined);
        toast("Buy box successfully!!!", toastType.SUCCESS);
      }
      setLoadingBoxBuy(false);
    } catch (error: any) {
      handleHideModalBuy();
      handleChangeNumberBoxBuy(0);
      setLoadingBoxBuy(false);
      toast(`Something was wrong when buy box`, "error");
    }
  };

  const handleOpenBox = async () => {
    setLoadingBoxOpen(true);
    const user = getUserFromLocal();
    if (!user?.signature || !address) {
      toast("Please login!!", "error");
      setLoadingBoxOpen(false);
      return;
    }
    const boxNumberOpenMap =
      numberBoxOpen > boxList?.length ? boxList?.length : numberBoxOpen;
    const boxListOpen = [...boxList].splice(0, boxNumberOpenMap);
    const listBoxOpenId = boxListOpen.map((value: any) => value?.nft_id);
    if (listBoxOpenId?.length) {
      try {
        const result = await openBox({
          wallet_address: address,
          signature: user?.signature,
          box_id: listBoxOpenId,
        });
        if (result?.data) {
          setLoadingBoxOpen(false);
          setReloadData(reloadData + 1);
          setBoxsOpen(result?.data?.cardArray);
          handleShowModalOpen();
          handleChangeNumberBoxOpen(0);
          toast("Open box successfully", toastType.SUCCESS);
        }
      } catch (e: any) {
        setLoadingBoxOpen(false);
        handleChangeNumberBoxOpen(0);
        toast(e?.response?.data?.code || "", "error");
      }
    } else {
      setLoadingBoxOpen(false);
      toast("No boxes!! Please buy boxes", "error");
    }
  };

  return (
    <div>
      <div className="open-box-loaded" />
      {isAllBoxSold ? (
        <div className="lg:flex flex-wrap gap-5 mt-[33px]">
          <div>
            <p className="text-[12px] text-[#0A1E42] opacity-60">Sold</p>
            <p className="text-[18px] font-[600] text-[#D30000]">
              {getBoxesText(boxSold)}
            </p>
          </div>
          <div className="text-left mx-0 lg:mx-auto">
            <p className="text-[12px] text-[#0A1E42] opacity-60">Open in</p>
            <p className="text-[18px] font-[600] text-[#0A1E42]">
              2 Days 12 Hours 05 Minutes
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-[8px] border-[#00246433] border-[1px] mt-[17px] mb-[7px] rounded-[12px] overflow-hidden">
            <div
              style={{ width: `${boxSoldWidth}%` }}
              className="h-full box-sold rounded-[12px]"
            ></div>
          </div>
          <div className="flex justify-between mt-3">
            <div>
              <p className="text-[12px] text-[#0A1E42] opacity-60">Sold</p>
              <p className="text-[18px] font-[600] text-[#D30000]">
                {getBoxesText(boxSold)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-[#0A1E42] opacity-60">Total</p>
              <p className="text-[18px] font-[600] text-[#0A1E42]">
                {getBoxesText(totalBox)}
              </p>
            </div>
          </div>
        </>
      )}
      <div className="grid xl:grid-cols-2 gap-[9px] mt-5 box-stage-open-buy">
        <BoxBuyOpen
          data={boxesBuy}
          disabled={!fxBoxContract || !busdContract || !address}
          numberBox={numberBoxBuy}
          handleNumBox={handleChangeNumberBoxBuy}
          actionPopup={handleShowModalBuy}
        />
        <BoxBuyOpen
          data={boxesOpen}
          disabled={!address}
          isBoxOpen
          isWaiting={!boxList}
          numberBox={numberBoxOpen}
          loading={loadingBoxOpen}
          handleNumBox={handleChangeNumberBoxOpen}
          actionPopup={handleOpenBox}
          isOpen
        />
      </div>
      <BuyBoxModal
        isOpen={isShowModalBuy}
        data={boxesBuy}
        numberBox={numberBoxBuy}
        loading={loadingBoxBuy}
        handleHideModal={handleHideModalBuy}
        handleBuyBox={handleBuyBox}
      />
      {isShowModalOpen && (
        <OpenBoxModal
          isOpen={isShowModalOpen}
          numberBox={numberBoxOpen}
          boxsOpen={boxsOpen}
          handleHideModal={handleHideModalOpen}
        />
      )}
    </div>
  );
};

export default LuckyBoxSold;

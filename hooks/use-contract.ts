/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FxBoxBox__factory } from "@/types/factories/box-factory";
import { FxBoxBox } from "@/types/box";
import { useSigner, useAccount } from "wagmi";
import { BUSDToken__factory } from "@/types/factories/busd-factory";
import { BUSDToken } from "@/types/busd-token";

export const FX_BOX_CONTRACT = process?.env?.NEXT_PUBLIC_FX_BOX || "";
export const BUSD_CONTRACT = process?.env?.NEXT_PUBLIC_TOKEN_ADDRESS || "";
export const FX_NFT_CONTRACT = process?.env?.NEXT_PUBLIC_FX_NFT || "";
export const NFT_CONTRACT_VIEW = process?.env?.NEXT_PUBLIC_NFT_CONTRACT || "";
export const PROJECT_ID = process?.env?.NEXT_PUBLIC_PROJECT_ID || "";

interface Returns {
  fxBoxContract: FxBoxBox | undefined;
  busdContract: BUSDToken | undefined;
}

export default function useContract(): Returns {
  const [boxContract, setBoxContract] = React.useState<FxBoxBox | undefined>(
    undefined
  );
  const [busdTokenContract, setBusdTokenContract] = React.useState<
    BUSDToken | undefined
  >(undefined);
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const initialize = async () => {
    if (address && signer) {
      let _boxContract: FxBoxBox = FxBoxBox__factory.connect(
        FX_BOX_CONTRACT,
        signer
      );
      setBoxContract(_boxContract);
      let _ewarTokenContract: BUSDToken = BUSDToken__factory.connect(
        BUSD_CONTRACT,
        signer
      );
      setBusdTokenContract(_ewarTokenContract);
    }
  };
  React.useEffect(() => {
    initialize();
  }, [address, signer]);

  return {
    fxBoxContract: boxContract,
    busdContract: busdTokenContract,
  };
}

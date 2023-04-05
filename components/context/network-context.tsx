/* eslint-disable react-hooks/exhaustive-deps */
import { toastType } from "@/constants/context";
import {
  getUserFromLocal,
  handleSignatureLogin,
  removeUserFromLocal,
  saveUserToLocal,
} from "@/utils/network";
import { signMessage } from "@wagmi/core";
import { useContext, useEffect, createContext, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { ToastContext } from "../context/toast-context";

interface NetworkType {
  signature: string;
  setSignature: (value: string) => void;
}

export const NetworkContext = createContext<NetworkType>({
  signature: "",
  setSignature: () => {},
});

export const bnbChainId = 97;

interface Props {
  children: any;
}

export const NetworkContextProvider = ({ children }: Props) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useContext(ToastContext);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [signature, setSignature] = useState<string>("");

  const handleChangeUser = async (address: string | any) => {
    try {
      const sign = await handleSignatureLogin(signMessage, address);
      setSignature(sign);
      saveUserToLocal(address, sign);
    } catch (err: any) {
      toast(err?.message, toastType.ERROR);
      disconnect && disconnect();
      removeUserFromLocal();
    }
  };

  useEffect(() => {
    if (chain?.id && chain?.id !== bnbChainId) {
      switchNetwork && switchNetwork(bnbChainId);
    }
  }, [chain]);

  useEffect(() => {
    if (!address) {
      removeUserFromLocal();
      setSignature("");
    }
    const dataUser: any = getUserFromLocal();
    if (dataUser?.address && dataUser?.address !== address) {
      handleChangeUser(address);
    }
  }, [address]);

  return (
    <NetworkContext.Provider value={{ signature, setSignature }}>
      {children}
    </NetworkContext.Provider>
  );
};

import { ConnectWalletModalType } from "@/types/modal-type";
import Image from "next/image";
import Modal from "../custom/modal-custom";
import { signMessage } from "@wagmi/core";
import {
  handleSignatureLogin,
  removeUserFromLocal,
  saveUserToLocal,
} from "@/utils/network";
import { userRegister } from "@/services/user-service";
import { useContext } from "react";
import { ToastContext } from "../context/toast-context";
import { toastType } from "@/constants/context";
import { useSignMessage } from "wagmi";
import { NetworkContext } from "../context/network-context";

const ConnectWalletModal = ({
  isOpen,
  connectors,
  isLoading,
  pendingConnector,
  handleHideModal,
  connectAsync,
  disconnect,
}: ConnectWalletModalType) => {
  const { toast } = useContext(ToastContext);
  const { setSignature } = useContext(NetworkContext);

  const handleConnect = async (connector: any) => {
    let account = "";
    let signature = "";
    try {
      const tx = await connectAsync(connector);
      if (tx && tx?.account) {
        account = tx.account;
        signature = await handleSignatureLogin(signMessage, account);
        setSignature(signature);
        saveUserToLocal(account, signature);
      }
    } catch (err: any) {
      toast(err?.message, toastType.ERROR);
      disconnect && disconnect();
      removeUserFromLocal();
      setSignature("");
    }
    try {
      if (signature && account) {
        await userRegister({
          wallet_address: account,
          signature: signature,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleHideModal}>
      <div className="px-[24px] lg:px-[34px]">
        <h1 className="text-[24px] lg:text-[28px] leading-[33px] font-[600]">
          Connect Wallet
        </h1>
        <div className="grid grid-cols-2 gap-[12px] mt-4 pb-5">
          {connectors?.map((connector) => {
            return (
              <div key={connector.id}>
                <button
                  className="border-[1px] mt-2 border-[#002464] border-opacity-20 p-[27px] rounded-[24px] bg-[#F4F7FF]"
                  disabled={connector && !connector.ready}
                  onClick={() => handleConnect({ connector })}
                >
                  <div>
                    <Image
                      src={`/images/icons/${connector?.id}.svg`}
                      width={80}
                      height={80}
                      alt={connector?.name}
                    />
                  </div>
                </button>
                <p className="text-[14px] lg:text-[16px] leading-[22px] mt-3 font-[600]">
                  {isLoading && connector.id === pendingConnector?.id
                    ? " (connecting)"
                    : connector.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;

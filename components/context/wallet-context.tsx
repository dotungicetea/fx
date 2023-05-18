import { createContext, useEffect, useMemo, useState } from "react";
import ConnectWalletModal from "../modals/connect-wallet-modal";
import { useAccount, useConnect, useDisconnect } from "wagmi";

interface WalletContextType {
  isConnectedAccount: boolean;
  showModalConnectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  isConnectedAccount: false,
  showModalConnectWallet: () => {},
});

export const WalletContextProvider = ({ children }: any) => {
  const { isConnected } = useAccount();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const { connectAsync, connectors, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const [isConnectedAccount, setIsConnectedAccount] = useState<boolean>(false);

  const hideModalConnectWallet = () => setIsShowModal(false);
  const showModalConnectWallet = () => setIsShowModal(true);

  useEffect(() => {
    setIsConnectedAccount(isConnected);
  }, [isConnected]);

  const isOpen = useMemo(() => {
    if (isConnectedAccount && !!isShowModal) {
      hideModalConnectWallet();
      return false;
    }
    return isShowModal;
  }, [isShowModal, isConnectedAccount]);

  return (
    <WalletContext.Provider
      value={{ isConnectedAccount, showModalConnectWallet }}
    >
      <ConnectWalletModal
        isOpen={isOpen}
        connectors={[connectors[0], connectors[2]]}
        isLoading={isLoading}
        pendingConnector={pendingConnector}
        handleHideModal={hideModalConnectWallet}
        connectAsync={connectAsync}
        disconnect={disconnect}
      />
      {children}
    </WalletContext.Provider>
  );
};

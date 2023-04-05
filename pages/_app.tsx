import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import GuestPortalLayout from "@/layout/guest-portal-layout";
import { ToastContextProvider } from "@/components/context/toast-context";
import { NetworkContextProvider } from "@/components/context/network-context";
import { bsc, bscTestnet } from "wagmi/chains";
import { PROJECT_ID } from "@/hooks/use-contract";

const { chains, provider } = configureChains(
  [bscTestnet],
  [alchemyProvider({ apiKey: "" }), publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        projectId: PROJECT_ID,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  // webSocketProvider,
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || GuestPortalLayout;

  return (
    <WagmiConfig client={client}>
      <ToastContextProvider>
        <NetworkContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </NetworkContextProvider>
      </ToastContextProvider>
    </WagmiConfig>
  );
}

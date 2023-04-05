import { ConnectArgs, Connector, ConnectResult } from "@wagmi/core";

export interface ConnectWalletModalType {
  isOpen: boolean;
  connectors: any[];
  isLoading: boolean;
  pendingConnector: Connector<any, any, any> | undefined;
  error?: Error | null;
  handleHideModal: () => void;
  connectAsync: (args?: Partial<ConnectArgs>) => Promise<ConnectResult<any>>;
  connect?: (args?: Partial<ConnectArgs> | undefined) => void;
  disconnect?: (variables: void, options?: any) => void;
}

export interface BuyBoxModalType {
  isOpen: boolean;
  data?: any;
  numberBox?: number;
  loading?: boolean;
  handleHideModal: () => void;
  handleBuyBox: () => void;
}

export interface OpenBoxModalType {
  isOpen: boolean;
  numberBox?: number;
  boxsOpen?: string[];
  handleHideModal: () => void;
}

export interface NftDetailModalType {
  isOpen: boolean;
  id: number | null;
  handleHideModal: () => void;
}

import { ConnectArgs, Connector, ConnectResult } from "@wagmi/core";

export interface DefaultModalType {
  isOpen: boolean;
  handleHideModal: () => void;
}

export interface ConnectWalletModalType extends DefaultModalType {
  connectors: any[];
  isLoading: boolean;
  pendingConnector: Connector<any, any, any> | undefined;
  error?: Error | null;
  connectAsync: (args?: Partial<ConnectArgs>) => Promise<ConnectResult<any>>;
  connect?: (args?: Partial<ConnectArgs> | undefined) => void;
  disconnect?: (variables: void, options?: any) => void;
}

export interface BuyBoxModalType extends DefaultModalType {
  data?: any;
  numberBox?: number;
  loading?: boolean;
  handleBuyBox: () => void;
}

export interface OpenBoxModalType extends DefaultModalType {
  numberBox?: number;
  boxsOpen?: string[];
}

export interface NftDetailModalType extends DefaultModalType {
  id: number | null;
}

export interface DurationListModalType extends DefaultModalType {
  dateRange: any;
  startDatetime: any;
  endDatetime: any;
  limitEndDatetime?: any;
  setDateRange: (dateRange: any) => void;
  setStartDatetime: (datetime: any) => void;
  setEndDatetime: (datetime: any) => void;
}

export interface ApproveListingModalType extends DefaultModalType {
  nftDetail: any;
  listingPrice: number | string;
  duration: string;
  fee: number;
  potentialEarning: number | string;
}

export interface EditListingModalType extends DefaultModalType {
  currentListing: any;
  price: number | undefined;
  currentPrice: number | string | null;
  reloadData: boolean;
  nftDetail: any;
  address: string | undefined;
  setIsEditingNft: (value: boolean) => void;
  toast: (message: string, type: string) => void;
  setReloadData: (reloadData: boolean) => void;
  handleShowModal: () => void;
  setPrice: (price: any) => void;
}

export interface CancelListingConfirmModalType extends DefaultModalType {
  isCancelAction?: boolean;
  isCancelBeforeEdit?: boolean;
  handleCancelListing: () => void;
}

export interface ListNftSuccessModalType extends DefaultModalType {
  isEdit?: boolean;
}

export interface MakeOfferModalType extends DefaultModalType {
  listing: any;
  currentPrice: number | null;
  nftDetail: any;
  reloadData: boolean;
  address: string | undefined;
  priceOffer: number | undefined;
  isShowConfirmPurchase: boolean;
  showConfirmPurchase: () => void;
  hideConfirmPurchase: () => void;
  setPriceOffer: (value: number | undefined) => void;
  handleShowModal: () => void;
  setReloadData: (value: boolean) => void;
}

export interface ConfirmPurchaseModalType extends DefaultModalType {
  nftDetail: any;
  listingPrice: number | undefined | null;
  handleMakeOffer: () => void;
}

export interface FinishPurchaseModalType extends DefaultModalType {
  isSuccess: boolean;
  id: number | string;
  transaction?: any;
  errorMessage?: string | undefined;
}

export interface CancelOfferModalType extends DefaultModalType {
  order: any;
  currentPrice: number | null;
  handleCancelOffer: () => void;
}

export interface AcceptOfferModalType extends DefaultModalType {
  order: any;
  currentPrice: number | null;
  address: string | undefined;
  handleAcceptOffer: () => void;
}

export interface FinishSoldModalType extends DefaultModalType {
  isSuccess: boolean;
  isProcessing: boolean;
  id: number | string;
  transaction?: any;
}

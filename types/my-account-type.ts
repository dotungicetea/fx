export interface CardItemType {
  card: any;
  handleShowCard: (id: number) => void;
}

export interface CardDetailInMyCardType {
  nftDetail: any;
  currentPrice?: number | null;
}

export interface ListNftInMyCardType {
  id: any;
  nftDetail: any;
  reloadData: boolean;
  address: string | undefined;
  toast: (message: string, type: string) => void;
  setReloadData: (reloadData: boolean) => void;
}

export interface ListingNftDetailType {
  isOwner?: boolean;
  nftDetail: any;
  address: string | undefined;
  currentPrice: number | null;
  listing?: any;
  reloadData: boolean;
  handleShowMakeOffer?: () => void;
  setReloadData: (reloadData: boolean) => void;
}

export interface ListingDurationType {
  isOwner?: boolean;
  nftDetail: any;
  currentPrice: number | null;
  listing: any;
  isEditingNft: boolean;
  currentListing: any;
  address: string | undefined;
  setIsListingExpired: (data: boolean) => void;
}

export interface ActionListingType {
  listing: any;
  reloadData: boolean;
  isListing: boolean;
  isListingExpired: boolean;
  address: string | undefined;
  toast: (message: string, type: string) => void;
  setIsSellNFT: (value: boolean) => void;
  setReloadData: (reloadData: boolean) => void;
  handleShowEditListing: () => void;
}

export interface FilterStatusInMycardType {
  statusCheck?: string;
  setStatusCheck?: (status: string) => void;
}

export interface FilterRarityInMycardType {
  rarityCheck?: string[];
  setRarityCheck?: (rarity: string[]) => void;
}

export interface FilterTypeInMycardType {
  currencyType?: any[] | undefined;
  typeCheck?: string[];
  setTypeCheck?: (type: string[]) => void;
  setSearchCard?: (searchCard: string) => void;
}

export interface FilterIsOwnerInMycardType {
  isOwnerCheck?: boolean;
  setIsOwnerCheck?: (isOwner: boolean) => void;
}

export interface FilterPricesInMycardType {
  filterPrices?: any;
  setFilterPrices?: (prices: any) => void;
}

export interface SortFilterInMycardType {
  currencyType?: any[] | undefined;
  statusCheck?: string;
  isOwnerCheck?: boolean;
  rarityCheck?: string[];
  typeCheck?: string[];
  filterPrices?: any;
  setStatusCheck?: (status: string) => void;
  setIsOwnerCheck?: (isOwner: boolean) => void;
  setRarityCheck?: (rarity: string[]) => void;
  setTypeCheck?: (type: string[]) => void;
  handleHideFilter?: () => void;
  setFilterPrices?: (prices: any) => void;
  setSearchCard?: (searchCard: string) => void;
}

export interface MyBoxType {
  boxNum: any;
}

export interface NftCardsType {
  nftList: any[] | undefined;
}

export interface EditListingType {
  currentListing: any;
  address: string | undefined;
  nftDetail: any;
  reloadData: boolean;
  isShowEditListing: boolean;
  currentPrice: number | string | null;
  handleShowEditListing: () => void;
  handleHideEditListing: () => void;
  setIsEditingNft: (value: boolean) => void;
  setReloadData: (reloadData: boolean) => void;
  toast: (message: string, type: string) => void;
}

export interface OffersListType {
  orders: any;
  address: string | undefined;
  currentPrice: number | null;
  reloadData: boolean;
  isOwner?: boolean;
  id?: any;
  isAccept?: boolean;
  toast: (message: string, type: string) => void;
  setReloadData: (reloadData: boolean) => void;
  handleShowMakeOffer: () => void;
}

export interface NftActivitiesType {
  activities: any | undefined;
  address: string | undefined;
}

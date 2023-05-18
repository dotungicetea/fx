export interface listNftInMarketType {
  nftList: any[] | null;
  isOwnerCheck: boolean;
  rarityCheck: string[];
  typeCheck: string[];
  filterPrices: any;
  meta: any;
  page: number;
  loading: boolean;
  setLastElement: any;
  setSort: (sort: string) => void;
  setIsOwnerCheck: (isOwner: boolean) => void;
  setRarityCheck: (rarity: string[]) => void;
  setTypeCheck: (type: string[]) => void;
  setFilterPrices: (prices: any) => void;
}

export interface MarketplaceCardItemType {
  card: any;
  setLastElement: any;
}

export interface DefaultAuthServiceType {
  wallet_address: string;
  signature: string;
}

export interface ServiceOpenBoxType extends DefaultAuthServiceType {
  box_id: string[] | number[];
}

export interface ServiceCreateOrderType extends DefaultAuthServiceType {
  input_order: any;
  order_hash: any;
  order_signature: string;
}

export interface ServiceNFTMarketDetailType extends DefaultAuthServiceType {
  token_id: string | number;
}

export interface ServiceCancelOrderType extends DefaultAuthServiceType {
  order_id: string | number;
}

export interface ServiceGetNftMarketType extends DefaultAuthServiceType {
  price_min: string;
  price_max: string;
  sort_by: string;
  page: number;
  size: number;
}

export interface ServiceFullFillOrderType extends DefaultAuthServiceType {
  order_id: string | number;
}

export interface ServiceMarketLogType extends DefaultAuthServiceType {
  activities: string[];
  page: number;
  size: number;
}

export interface ServiceOffersListType extends DefaultAuthServiceType {
  page: number;
  size: number;
  sort_by: string;
}

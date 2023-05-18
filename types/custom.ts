export interface CartNftType {
  classNameOut?: string;
  className?: string;
  baseMp?: number;
  level?: number;
  rarity?: string;
  symbol?: string;
  size?: string;
  prices?: number | null | undefined;
}

export interface TooltipType {
  children: any;
  isTop?: boolean;
  content: string;
}

export interface TooltipContentType {
  style: any;
  isTop: boolean | undefined;
  content: string;
}

import { Dispatch, SetStateAction } from "react";
import { MainNavType } from "./nav-type";

export interface ModalInputType {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: any;
  isNormalModal?: boolean;
}

export interface TabType {
  tabsContent: string[];
  tabNumber: number;
  isButton?: boolean;
  hrefButton?: string;
  className?: string;
  lineClassName?: string;
  handleChangeTab: (tab: number) => void;
}

export interface OptionsType {
  name: string;
  value: string;
}

export interface SelectType {
  plachoderOptions?: OptionsType;
  options: OptionsType[];
  className?: string;
  value?: any;
  onChange?: (value: string) => void;
}

export interface InputType {
  className?: string;
  searchClassName?: string;
  searchSizes?: string;
  padding?: string;
  isForm?: boolean;
  bg?: string;
  border?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface CommingSoonType {
  title: string;
}

export interface HeaderType {
  setIsShow: Dispatch<SetStateAction<boolean>>;
}

export interface NavbarType {
  nav: MainNavType;
  setShowNav: Dispatch<SetStateAction<boolean>>;
}

export interface PaginationType {
  pages: number;
  currentPage: number;
  onChange: (value: number) => void;
}

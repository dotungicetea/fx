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
  handleChangeTab: (tab: number) => void;
}

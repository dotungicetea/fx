export interface ToastContextType {
  toast: (message: string, type: string) => void;
}

export interface ToastShowType {
  message: string;
  type: string;
}

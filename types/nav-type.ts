export interface SubPathnameType {
  content: string;
  url: string;
  pathname: string;
}

export interface MainNavType {
  img: string;
  content: string;
  url: string;
  pathname: string;
  subItems?: SubPathnameType[];
}

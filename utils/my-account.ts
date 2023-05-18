import { sortTypes } from "@/constants/my-account";

export const getCurrencyType = (listNfts: any[] | undefined) => {
  if (!listNfts || !listNfts?.length) return [];
  const currencyTypes = [] as any[];
  listNfts?.forEach((nft) => {
    const indexNftExist = currencyTypes.findIndex(
      (type) => type?.value?.toLowerCase() === nft?.symbol?.toLowerCase()
    );
    if (indexNftExist === -1 && nft?.symbol) {
      const data = {
        name: nft?.name,
        value: nft?.symbol,
      };
      currencyTypes.push(data);
    }
  });
  const currencyTypesSorted = currencyTypes?.sort((a: any, b: any) =>
    a.value > b.value ? 1 : -1
  );
  return currencyTypesSorted;
};

const sortByLevel = (cards: any[], isDesc: boolean) => {
  const cloneCard = cards?.map((card) => {
    const level = card?.attributes?.find(
      (att: any) => att?.trait_type?.toLowerCase() === "level"
    )?.value;
    const levelNumber = level
      ? typeof level === "number"
        ? level
        : Number(level)
      : 0;
    return { ...card, level: levelNumber };
  });
  cloneCard.sort((a, b) => {
    return isDesc ? b?.level - a?.level : a?.level - b?.level;
  });
  return cloneCard;
};

const sortByMP = (cards: any[], isDesc: boolean) => {
  const cloneCard = cards?.map((card) => {
    const mp = card?.attributes?.find(
      (att: any) => att?.trait_type?.toLowerCase() === "mp"
    )?.value;
    const mpNumber = mp ? (typeof mp === "number" ? mp : Number(mp)) : 0;
    return { ...card, mp: mpNumber };
  });
  cloneCard.sort((a, b) => {
    return isDesc ? b?.mp - a?.mp : a?.mp - b?.mp;
  });
  return cloneCard;
};

export const handleSortMyCard = (cards: any[] | undefined, sort: string) => {
  if (!cards) return [];
  if (!sort) return cards;
  switch (sort) {
    case sortTypes.PRICEHIGHTOLOW:
      return cards;
    case sortTypes.PRICELOWTOHIGH:
      return cards;
    case sortTypes.LEVELLOWTOHIGH:
      return sortByLevel(cards, false);
    case sortTypes.LEVELHIGHTOLOW:
      return sortByLevel(cards, true);
    case sortTypes.MPHIGHTTOLOW:
      return sortByMP(cards, true);
    case sortTypes.MPLOWTOHIGH:
      return sortByMP(cards, false);
    case sortTypes.ENDINGSOON:
      return cards;
  }
};

export const handleSortMarket = (sort: string) => {
  switch (sort) {
    case sortTypes.PRICEHIGHTOLOW:
      return "price_desc";
    case sortTypes.PRICELOWTOHIGH:
      return "price_asc";
    case sortTypes.LEVELLOWTOHIGH:
      return "lvl_desc";
    case sortTypes.LEVELHIGHTOLOW:
      return "lvl_asc";
    case sortTypes.MPHIGHTTOLOW:
      return "mining_desc";
    case sortTypes.MPLOWTOHIGH:
      return "mining_asc";
    case sortTypes.ENDINGSOON:
      return "price_asc";
    default:
      return "price_asc";
  }
};

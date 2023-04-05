export const nftCardTypes = {
  LEGENDARY: "legendary",
  EPIC: "epic",
  RARE: "rare",
  UNCOMMON: "uncommon",
  COMMON: "common",
};

export const nftCardTypesInBox = [
  {
    type: nftCardTypes.COMMON,
    title: nftCardTypes.COMMON,
    rate: "56.8%",
    color: "common-type",
    mining: "1 ~ 3",
  },
  {
    type: nftCardTypes.UNCOMMON,
    title: nftCardTypes.UNCOMMON,
    rate: "28.8%",
    color: "uncommon-type",
    mining: "4 ~ 6",
  },
  {
    type: nftCardTypes.RARE,
    title: nftCardTypes.RARE,
    rate: "10.6%",
    color: "rare-type",
    mining: "7 ~ 11",
  },
  {
    type: nftCardTypes.EPIC,
    title: nftCardTypes.EPIC,
    rate: "3.4%",
    color: "epic-type",
    mining: "12 ~ 30",
  },
  {
    type: nftCardTypes.LEGENDARY,
    title: nftCardTypes.LEGENDARY,
    rate: "0.4%",
    color: "legendary-type",
    mining: "60-100",
  },
];

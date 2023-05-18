export const filterTitle = {
  RARITY: "rarity",
  CURRENCY_TYPE: "currency type",
  STATUS: "status",
};

export const rarityValues = {
  LEGENDARY: "Legendary",
  EPIC: "Epic",
  RARE: "Rare",
  UNCOMMON: "Uncommon",
  COMMON: "Common",
};

export const statusValues = {
  LISTING: "listing",
  UNLISTED: "unlisted",
  MINING: "mining",
  TEAMING: "teaming",
  STAKING: "taking",
};

export const filterStatus = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Listing",
    value: statusValues.LISTING,
  },
  {
    name: "Unlisted",
    value: statusValues.UNLISTED,
  },
  {
    name: "Teaming",
    value: statusValues.TEAMING,
  },
  {
    name: "Staking",
    value: statusValues.STAKING,
  },
];

export const filterRarity = [
  {
    name: "Legendary",
    value: rarityValues.LEGENDARY,
  },
  {
    name: "Epic",
    value: rarityValues.EPIC,
  },
  {
    name: "Rare",
    value: rarityValues.RARE,
  },
  {
    name: "Uncommon",
    value: rarityValues.UNCOMMON,
  },
  {
    name: "Common",
    value: rarityValues.COMMON,
  },
];

export const filterIsOwner = [
  {
    name: "Show all NFTs",
    value: false,
  },
  {
    name: "My NFTs",
    value: true,
  },
];

export const sortTypes = {
  PRICEHIGHTOLOW: "price high to low",
  PRICELOWTOHIGH: "price low to high",
  LEVELLOWTOHIGH: "level low to high",
  LEVELHIGHTOLOW: "level high to low",
  MPHIGHTTOLOW: "mp high to low",
  MPLOWTOHIGH: "mp low to high",
  ENDINGSOON: "ending soon",
};

export const listSortTypes = [
  {
    name: "Price high to low",
    value: sortTypes.PRICEHIGHTOLOW,
  },
  {
    name: "Price low to high",
    value: sortTypes.PRICELOWTOHIGH,
  },
  {
    name: "Level low to high",
    value: sortTypes.LEVELLOWTOHIGH,
  },
  {
    name: "Level high to low",
    value: sortTypes.LEVELHIGHTOLOW,
  },
  {
    name: "Mining Power high to low",
    value: sortTypes.MPHIGHTTOLOW,
  },
  {
    name: "Mining Power low to high",
    value: sortTypes.MPLOWTOHIGH,
  },
  {
    name: "Ending soon",
    value: sortTypes.ENDINGSOON,
  },
];

export const listSortTypesInMyAccount = [
  {
    name: "Level low to high",
    value: sortTypes.LEVELLOWTOHIGH,
  },
  {
    name: "Level high to low",
    value: sortTypes.LEVELHIGHTOLOW,
  },
  {
    name: "Mining Power high to low",
    value: sortTypes.MPHIGHTTOLOW,
  },
  {
    name: "Mining Power low to high",
    value: sortTypes.MPLOWTOHIGH,
  },
];

export const dateRangeType = {
  SEVENDAY: "SEVENDAY",
  FIFTEENDAY: "FIFTEENDAY",
  ONEMONTH: "ONEMONTH",
  TWOMONTH: "TWOMONTH",
  SIXMONTH: "SIXMONTH",
};

export const dateRanges = [
  {
    name: "7 days",
    value: dateRangeType.SEVENDAY,
  },
  {
    name: "15 days",
    value: dateRangeType.FIFTEENDAY,
  },
  {
    name: "1 month",
    value: dateRangeType.ONEMONTH,
  },
  {
    name: "2 months",
    value: dateRangeType.TWOMONTH,
  },
  {
    name: "6 months",
    value: dateRangeType.SIXMONTH,
  },
];

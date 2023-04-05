export const filterTitle = {
  RARITY: "rarity",
  CURRENCY_TYPE: "currency type",
  STATUS: "status",
};

export const rarityValues = ["legendary", "epic", "rare", "uncommon", "common"];
export const symbolValues = ["usd", "eur", "cny", "idr", "brl"];
export const statusValues = ["listing", "unlisted", "mining", "teaming"];

export const sortFilter = [
  {
    name: filterTitle.RARITY,
    values: rarityValues,
  },
  {
    name: filterTitle.CURRENCY_TYPE,
    values: symbolValues,
  },
  {
    name: filterTitle.STATUS,
    values: ["listing", "unlisted", "mining", "teaming"],
  },
];

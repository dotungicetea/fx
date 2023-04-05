export const pathname = {
  LUCKYBOX: "/",
  MARKETPLACE: "/marketplace",
  CARDNFTS: "/card-nfts",
  NFTMINING: "/nft-mining",
  NFTTEAMING: "/nft-teaming",
  NFTMERGING: "/nft-merging",
  NFTSUMMON: "/nft-summon",
  LEADERBOARD: "/leaderboard",
  STAKING: "/staking",
  LOTTERY: "/lottery",
  ORACLE: "/oracle",
  MYACCOUNT: "/my-account",
  MYPROFILE: "/my-profile",
  MYCARDS: "/my-cards",
  MYTRANSACTIONS: "/my-transactions",
};

export const navbarItemsMain = [
  {
    img: "/images/icons/lucky_box.svg",
    content: "Lucky Box",
    url: "",
    pathname: pathname.LUCKYBOX,
  },
  {
    img: "/images/icons/marketplace.svg",
    content: "Marketplace",
    url: "",
    pathname: pathname.MARKETPLACE,
  },
  {
    img: "/images/icons/card_nfts.svg",
    content: "Card NFTs",
    url: "",
    pathname: pathname.CARDNFTS,
    subItems: [
      {
        content: "NFT mining",
        url: "",
        pathname: `${pathname.CARDNFTS}${pathname.NFTMINING}`,
      },
      {
        content: "NFT Teaming",
        url: "",
        pathname: `${pathname.CARDNFTS}${pathname.NFTTEAMING}`,
      },
      {
        content: "NFT Merging",
        url: "",
        pathname: `${pathname.CARDNFTS}${pathname.NFTMERGING}`,
      },
      {
        content: "NFT Summon",
        url: "",
        pathname: `${pathname.CARDNFTS}${pathname.NFTSUMMON}`,
      },
    ],
  },
  {
    img: "/images/icons/leaderboard.svg",
    content: "Leaderboard",
    url: "",
    pathname: pathname.LEADERBOARD,
  },
  {
    img: "/images/icons/staking.svg",
    content: "Staking",
    url: "",
    pathname: pathname.STAKING,
  },
  {
    img: "/images/icons/lottery.svg",
    content: "Lottery",
    url: "",
    pathname: pathname.LOTTERY,
  },
  {
    img: "/images/icons/oracle.svg",
    content: "Oracle",
    url: "",
    pathname: pathname.ORACLE,
  },
  {
    img: "/images/icons/my_account.svg",
    content: "My Account",
    url: "",
    pathname: pathname.MYACCOUNT,
    subItems: [
      {
        content: "Profile",
        url: "",
        pathname: `${pathname.MYACCOUNT}${pathname.MYPROFILE}`,
      },
      {
        content: "Cards",
        url: "",
        pathname: `${pathname.MYACCOUNT}${pathname.MYCARDS}`,
      },
      {
        content: "Transactions",
        url: "",
        pathname: `${pathname.MYACCOUNT}${pathname.MYTRANSACTIONS}`,
      },
    ],
  },
];

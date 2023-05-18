import { BigNumber, ethers } from "ethers";
import { SignMessageArgs, SignMessageResult } from "@wagmi/core";

export const handleSignatureLogin = async (
  signMessage: (args: SignMessageArgs) => Promise<SignMessageResult>,
  account: string
) => {
  return await signMessage({
    message: `fxbox wants you to sign in with your Ethereum account:
        ${account}`,
  });
};

export const saveUserToLocal = (address: string, signature: string) => {
  const data = {
    address: address,
    signature: signature,
  };
  const dataJson = JSON.stringify(data);
  localStorage.setItem("user", dataJson);
};

export const removeUserFromLocal = () => localStorage.removeItem("user");

export const getUserFromLocal = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : {};
};

export const wei2ether = (num: number | any) => {
  if (!num) return "_._";
  try {
    return ethers.utils.formatEther(num.toString() || "0");
  } catch (e) {
    return "";
  }
};

export const wei2Number = (num: number | any | string) => {
  if (!num) return "0";
  try {
    if (typeof num === "string") {
      return ethers.utils.formatEther(Number(num) || "0");
    } else {
      const bigNumberFormat = num.toLocaleString("fullwide", {
        useGrouping: false,
      });
      return ethers.utils.formatEther(bigNumberFormat || "0");
    }
  } catch (e) {
    return "0";
  }
};

export const convertDecimalToNum = (num: number | string) => {
  if (!num) return 0;
  try {
    const numConverted = typeof num === "string" ? num : num?.toString();
    const balance = BigNumber.from(numConverted);
    return Number(ethers.utils.formatEther(balance));
  } catch (e) {
    return 0;
  }
};

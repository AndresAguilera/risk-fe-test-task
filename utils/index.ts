import { tokens } from "@/data/mock";
import { Token } from "@/model/token";

export const getCodeByAddress = (address: string): string =>
  tokens.find((tok) => tok.address === address)?.name || "";

export const getTokenByAddress = (address: string): Token | undefined =>
  tokens.find((tok: Token) => tok.address.toLowerCase() === address);

export const formatCurrency = (amount: number, decimals: number = 18) =>
  amount / 10 ** decimals;
// (amount / 10 ** decimals).toLocaleString("en-US", {
//   style: "currency",
//   currency: "USD",
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });

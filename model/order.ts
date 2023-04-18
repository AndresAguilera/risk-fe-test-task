// oversimplified types, ideally should be validated
export interface Order {
  sender: string;
  maker: string;
  taker: string;
  takerTokenFeeAmount: number | string;
  makerAmount: number | string;
  takerAmount: number | string;
  makerToken: string;
  takerToken: string;
  salt: number;
  verifyingContract: string;
  feeRecipient: string;
  expiry: number;
  chainId: number;
  pool: string;
}

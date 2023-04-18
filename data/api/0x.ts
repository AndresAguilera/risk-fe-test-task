export interface FetchOrderBookArgs {
  token1: string;
  token2: string;
}

export const fetchOrderBook = ({ token1, token2 }: FetchOrderBookArgs) =>
  fetch(
    `https://api.0x.org/orderbook/v1?quoteToken=${token1}&baseToken=${token2}`
  ).then((res) => res.json());

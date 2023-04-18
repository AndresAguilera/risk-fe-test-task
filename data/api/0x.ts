export interface FetchOrderBookArgs {
  baseToken: string;
  quoteToken: string;
}

export const fetchOrderBook = ({ baseToken, quoteToken }: FetchOrderBookArgs) =>
  fetch(
    `https://api.0x.org/orderbook/v1?quoteToken=${quoteToken}&baseToken=${baseToken}`
  ).then((res) => res.json());

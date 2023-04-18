import { useQuery } from "@tanstack/react-query";
import { fetchOrderBook, FetchOrderBookArgs } from "@/data/api/0x";

export const useOrderBook = (data: FetchOrderBookArgs) =>
  useQuery({
    queryKey: ["order book", data.token1, data.token2],
    queryFn: () => fetchOrderBook(data),
  });

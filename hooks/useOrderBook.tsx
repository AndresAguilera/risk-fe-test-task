import { useQuery } from "@tanstack/react-query";
import { fetchOrderBook, FetchOrderBookArgs } from "@/data/api/0x";

export const useOrderBook = (data: FetchOrderBookArgs) =>
  useQuery({
    queryKey: ["order book", data.baseToken, data.quoteToken],
    queryFn: () => fetchOrderBook(data),
  });

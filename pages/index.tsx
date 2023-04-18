import PairSelector from "@/components/PairSelector";
import { createContext, Dispatch, useState } from "react";
import { tokens } from "@/data/mock";
import OrderBook from "@/components/OrderBook";

const defaultValues: {
  baseToken: string;
  quoteToken: string;
  setBaseToken: Dispatch<any>;
  setQuoteToken: Dispatch<any>;
} = {
  quoteToken: tokens[0].address,
  baseToken: tokens[1].address,
  setBaseToken: () => {},
  setQuoteToken: () => {},
};

export const PairContext = createContext(defaultValues);

export default function Home() {
  const [baseToken, setBaseToken] = useState<string>(tokens[0].address);
  const [quoteToken, setQuoteToken] = useState<string>(tokens[1].address);
  return (
    <PairContext.Provider
      value={{
        baseToken,
        quoteToken,
        setBaseToken,
        setQuoteToken,
      }}
    >
      <main>
        <div className="h-screen">
          <OrderBook />
          <PairSelector />
        </div>
      </main>
    </PairContext.Provider>
  );
}

import PairSelector from "@/components/PairSelector";
import { createContext, Dispatch, useState } from "react";
import { tokens } from "@/data/mock";
import OrderBook from "@/components/OrderBook";

const defaultValues: {
  token1: string;
  token2: string;
  setToken1: Dispatch<any>;
  setToken2: Dispatch<any>;
} = {
  token1: tokens[0].address,
  token2: tokens[1].address,
  setToken1: () => {},
  setToken2: () => {},
};

export const PairContext = createContext(defaultValues);

export default function Home() {
  const [token1, setToken1] = useState<string>(tokens[0].address);
  const [token2, setToken2] = useState<string>(tokens[1].address);
  return (
    <PairContext.Provider
      value={{
        token1,
        token2,
        setToken1,
        setToken2,
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

import React, { FC, useState } from "react";
import { tokens } from "@/data/mock";
import Select from "@/components/PairSelector/Select";
import { useOrderBook } from "@/hooks/useOrderBook";

interface PairSelectorProps {}

const PairSelector: FC<PairSelectorProps> = () => {
  const [token1, setToken1] = useState<string>(tokens[0].address);
  const [token2, setToken2] = useState<string>(tokens[1].address);

  const { data, status } = useOrderBook({ token1, token2 });

  console.log(data, status);

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-2xl font-bold">Select a trading pair</h1>
      <div className="flex space-x-4">
        <Select token={token1} onChange={(e) => setToken1(e.target.value)} />
        <Select token={token2} onChange={(e) => setToken2(e.target.value)} />
      </div>
    </div>
  );
};

export default PairSelector;

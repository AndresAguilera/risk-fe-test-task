import React, { FC, useContext } from "react";
import Select from "@/components/PairSelector/Select";
import { PairContext } from "@/pages";

interface PairSelectorProps {}
const PairSelector: FC<PairSelectorProps> = () => {
  const { token1, token2, setToken1, setToken2 } = useContext(PairContext);

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-2xl font-bold">Select a trading pair</h1>
      <div className="flex space-x-4">
        <Select
          tokenAddress={token1}
          onChange={(e) => setToken1(e.target.value)}
        />
        <Select
          tokenAddress={token2}
          onChange={(e) => setToken2(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PairSelector;

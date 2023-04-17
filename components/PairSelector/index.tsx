import React, { FC, useState } from "react";
import { Carat } from "@/components/Icons/Icons";
import { tokens } from "@/data/mock";

interface PairSelectorProps {}

const PairSelector: FC<PairSelectorProps> = () => {
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col space-y-8 ">
        <h1 className="text-2xl font-bold">Select a trading pair</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <select
              value={token1}
              onChange={(e) => setToken1(e.target.value)}
              className="block appearance-none w-full py-2 px-3 pr-8 bg-white border border-gray-300 rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
            >
              {tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Carat />
            </div>
          </div>
          <div className="relative">
            <select
              value={token2}
              onChange={(e) => setToken2(e.target.value)}
              className="block appearance-none w-full py-2 px-3 pr-8 bg-white border border-gray-300 rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
            >
              {tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Carat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairSelector;

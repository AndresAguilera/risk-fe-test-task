import React, { EventHandler, FC } from "react";
import { tokens } from "@/data/mock";
import { Carat } from "@/components/Icons/Icons";

interface SelectProps {
  tokenAddress: string;
  onChange: EventHandler<any>;
}

const Select: FC<SelectProps> = ({ tokenAddress, onChange }) => {
  return (
    <div className="relative">
      <select
        value={tokenAddress}
        onChange={onChange}
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
  );
};

export default Select;

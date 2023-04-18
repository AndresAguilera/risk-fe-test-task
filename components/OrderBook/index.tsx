import React, { useContext } from "react";
import { Order } from "@/model/order";
import { useOrderBook } from "@/hooks/useOrderBook";
import { PairContext } from "@/pages";

const OrderBook: React.FC = () => {
  const { token1, token2 } = useContext(PairContext);
  const { data } = useOrderBook({ token1, token2 });

  const bids: Order[] = data?.bids?.records.map((record: any) => record.order);
  const asks: Order[] = data?.asks?.records.map((record: any) => record.order);

  return (
    <div className="flex justify-between">
      <div className="flex-1 pr-4">
        <h2 className="text-2xl font-semibold mb-2">Bids</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Price</th>
              <th className="text-left">Size</th>
            </tr>
          </thead>
          <tbody>
            {bids?.map((bid, i) => (
              <tr key={bid.chainId + bid.takerToken + i}>
                <td className="text-green-500">{bid.takerAmount}</td>
                <td>{bid.takerAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-1 pl-4">
        <h2 className="text-2xl font-semibold mb-2">Asks</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Price</th>
              <th className="text-left">Size</th>
            </tr>
          </thead>
          <tbody>
            {asks?.map((ask, i) => (
              <tr key={ask.chainId + ask.takerToken + i}>
                <td className="text-red-500">{ask.makerAmount}</td>
                <td>{ask.makerAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;

import React, { useContext, useMemo } from "react";
import { Order } from "@/model/order";
import { useOrderBook } from "@/hooks/useOrderBook";
import { PairContext } from "@/pages";
import { formatCurrency, getCodeByAddress, getTokenByAddress } from "@/utils";

interface OrderBookRow extends Order {
  price: number;
  quantity: number;
  total: number;
}

const OrderBook: React.FC = () => {
  const { baseToken, quoteToken } = useContext(PairContext);
  const { data } = useOrderBook({ baseToken, quoteToken });

  const currentCurrency = getCodeByAddress(quoteToken);

  const bids: OrderBookRow[] = useMemo(() => {
    if (!data?.bids) return [];

    const orders = data.bids.records.map((record: any) => {
      const order: Order = record.order;
      const decimals = getTokenByAddress(order.makerToken)?.decimals;
      const quantity = formatCurrency(order.makerAmount, decimals);
      const price = formatCurrency(
        order.takerAmount / order.makerAmount,
        decimals
      );
      const total = 0;

      return {
        ...order,
        price,
        quantity,
        total,
      };
    });

    orders.forEach((order: OrderBookRow, i: number) => {
      if (i === 0) {
        order.total = Number(order.quantity);
      } else {
        order.total = Number(order.quantity) + orders[i - 1].total;
      }
    });

    return orders;
  }, [data?.bids]);

  const asks: OrderBookRow[] = useMemo(() => {
    if (!data?.asks) return [];

    const orders = data.asks.records.map((record: any) => {
      const order: Order = record.order;
      const decimals = getTokenByAddress(order.takerToken)?.decimals;
      const quantity = formatCurrency(order.takerAmount, decimals);
      const price = formatCurrency(
        order.makerAmount / order.takerAmount,
        decimals
      );
      const total = 0;

      return {
        ...order,
        price,
        quantity,
        total,
      };
    });

    orders.forEach((order: OrderBookRow, i: number) => {
      if (i === 0) {
        order.total = Number(order.quantity);
      } else {
        order.total = Number(order.quantity) + orders[i - 1].total;
      }
    });

    return orders;
  }, [data?.asks]);

  return (
    <div className="flex justify-between">
      <div className="flex-1 pr-4">
        <h2 className="text-2xl font-semibold mb-2">Bids</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Price ({currentCurrency})</th>
              <th className="text-left">Quantity ({currentCurrency})</th>
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {bids?.map((bid, i) => (
              <tr key={bid.chainId + bid.takerToken + i}>
                <td className="text-green-500">{bid.price}</td>
                <td>{bid.quantity}</td>
                <td>{bid.total}</td>
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
              <th className="text-left">Price ({currentCurrency})</th>
              <th className="text-left">Quantity ({currentCurrency})</th>
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {asks?.map((ask, i) => (
              <tr key={ask.chainId + ask.makerToken + i}>
                <td className="text-red-500">{ask.price}</td>
                <td>{ask.quantity}</td>
                <td>{ask.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;

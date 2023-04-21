import React, { useContext } from 'react'
import { OrderBookRow, useOrderBook } from '@/hooks/useOrderBook'
import { getNameByAddress } from '@/utils'
import { PairContext } from '@/context/tokenPair'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })

    const currentCurrency = getNameByAddress(quoteToken)

    const headers = [`Price (${currentCurrency})`, `Quantity (${currentCurrency})`, 'Total']

    const renderTable = (orders: OrderBookRow[], isBid: boolean) => {
        return (
            <div className="flex-1 pr-4">
                <h2 className="text-2xl font-semibold mb-2">{isBid ? 'Bids' : 'Asks'}</h2>
                <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <thead>
                        <tr
                            className={`bg-gradient-to-${
                                isBid ? 'r' : 'l'
                            } from-green-400 to-blue-500 text-gray-200`}
                        >
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="text-left py-3 px-4 tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.slice(0, 20).map((order, i) => (
                            <tr key={order.salt + i} className="hover:bg-gray-50">
                                <td
                                    className={`text-${
                                        isBid ? 'green' : 'red'
                                    }-500 font-medium py-3 px-4`}
                                >
                                    {order.price}
                                </td>
                                <td className="py-3 px-4">{order.quantity}</td>
                                <td className="py-3 px-4">{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="flex justify-between">
            {renderTable(bids, true)}
            {renderTable(asks, false)}
        </div>
    )
}

export default OrderBook

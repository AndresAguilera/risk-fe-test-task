import React, { useContext } from 'react'
import { OrderBookRow, useOrderBook } from '@/hooks/useOrderBook'
import { getTokenByAddress } from '@/utils'
import { PairContext } from '@/context/tokenPair'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })

    const currentCurrency = getTokenByAddress(quoteToken)?.symbol

    const headers = [`Price (${currentCurrency})`, `Quantity (${currentCurrency})`, 'Total']

    const renderTable = (orders: OrderBookRow[], isBid: boolean) => {
        const gradient = isBid
            ? 'bg-gradient-to-r from-green-500 to-blue-500'
            : 'bg-gradient-to-l from-pink-500 to-red-500'

        return (
            <div className="flex-1 mr-4 block">
                <h2 className="text-2xl font-semibold mb-2">{isBid ? 'Bids' : 'Asks'}</h2>
                <table className="w-full bg-white rounded-lg shadow-md overflow-hidden text-sm">
                    <thead className={'text-gray-200'}>
                        <tr className={gradient}>
                            {headers.map((header, index) => (
                                <th
                                    key={header}
                                    className={`text-left py-3 px-4 tracking-wider whitespace-nowrap ${
                                        index === 1 ? 'hidden sm:block' : ''
                                    }`}
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
                                    }-500 font-medium py-3 pl-2`}
                                >
                                    {order.price}
                                </td>
                                <td className="py-3 px-4 hidden sm:block">{order.quantity}</td>
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

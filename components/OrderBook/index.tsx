import React, { useContext } from 'react'
import { OrderBookRow, useOrderBook } from '@/hooks/useOrderBook'
import { getTokenByAddress } from '@/utils'
import { PairContext } from '@/context/tokenPair'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })

    const currentCurrency = getTokenByAddress(quoteToken)?.symbol

    const renderOrders = (orders: OrderBookRow[], isBid: boolean) => {
        const gradient = isBid
            ? 'bg-gradient-to-r from-green-500 to-blue-500'
            : 'bg-gradient-to-l from-pink-500 to-red-500'

        return (
            <div className="flex-1 mr-4 block">
                <h2 className="text-2xl font-semibold mb-2">{isBid ? 'Bids' : 'Asks'}</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden text-sm">
                    <div className={`flex ${gradient} text-white`}>
                        <div className="flex-1 py-3 px-4 tracking-wider whitespace-nowrap">
                            Price ({currentCurrency})
                        </div>
                        <div className="flex-1 py-3 px-4 tracking-wider whitespace-nowrap hidden lg:block">
                            Quantity ({currentCurrency})
                        </div>
                        <div className="flex-1 py-3 px-4 tracking-wider whitespace-nowrap">
                            Total
                        </div>
                    </div>
                    {orders?.slice(0, 20).map((order, i) => (
                        <div key={order.salt + i} className={`flex hover:bg-gray-200`}>
                            <div
                                className={`flex-1 text-${
                                    isBid ? 'green' : 'red'
                                }-500 font-medium py-3 pl-2`}
                            >
                                {order.price}
                            </div>
                            <div className="flex-1 py-3 px-4 hidden lg:block">{order.quantity}</div>
                            <div className="flex-1 py-3 px-4">{order.total}</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between">
            {renderOrders(bids, true)}
            {renderOrders(asks, false)}
        </div>
    )
}

export default OrderBook

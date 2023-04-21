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

        const greenOrRed = isBid ? 'green' : 'red'
        const headers = ['Price', 'Quantity', 'Total']
        return (
            <div className="flex-1 mr-4 block">
                <h2 className="text-2xl font-semibold mb-2">{isBid ? 'Bids' : 'Asks'}</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden text-sm">
                    <div className={`flex ${gradient} text-white font-bold`}>
                        {(isBid ? headers : headers.reverse()).map((header, i) => (
                            <div
                                key={header}
                                className={`flex-1 py-3 px-4 tracking-wider whitespace-nowrap ${
                                    i === 1 ? 'hidden lg:block' : ''
                                }`}
                            >
                                {header} ({currentCurrency})
                            </div>
                        ))}
                    </div>
                    {orders?.slice(0, 20).map((order, i) => {
                        const row = [
                            <div
                                key={order.price}
                                className={`flex-1 text-${greenOrRed}-500 font-medium py-3 pl-2`}
                            >
                                {order.price}
                            </div>,
                            <div key={order.quantity} className="flex-1 py-3 hidden lg:block">
                                {order.quantity}
                            </div>,
                            <div key={order.total} className="flex-1 py-3">
                                <div className={`absolute w-[13%] h-5 bg-${greenOrRed}-200 z-0`} />
                                <div className={'z-10 relative'}>{order.total}</div>
                            </div>,
                        ]
                        return (
                            <div key={order.salt + i} className={`flex hover:bg-gray-200`}>
                                {isBid ? row : row.reverse()}
                            </div>
                        )
                    })}
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

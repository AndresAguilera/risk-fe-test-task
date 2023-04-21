import React, { useContext } from 'react'
import { OrderBookRow, useOrderBook } from '@/hooks/useOrderBook'
import { formatCurrency, getTokenByAddress } from '@/utils'
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden text-sm">
                    <div className={`flex ${gradient} text-white font-bold`}>
                        {(isBid ? headers : headers.reverse()).map((header, i) => (
                            <div
                                key={header + isBid}
                                className={`flex-1 py-3 px-4 tracking-wider whitespace-nowrap ${
                                    i === 1 ? 'hidden lg:block' : ''
                                }`}
                            >
                                {header} ({currentCurrency})
                            </div>
                        ))}
                    </div>
                    {orders?.slice(0, 20).map((order, i, array) => {
                        const maxTotal = orders[array.length - 1].total
                        const curTotal = order.total
                        const arbMax = 13

                        const ratio = Math.round((curTotal / maxTotal) * arbMax)
                        const barWidth = ratio > arbMax ? arbMax : ratio === 0 ? 1 : ratio
                        const row = [
                            <div
                                key={order.price + 'price'}
                                className={`flex-1 text-${greenOrRed}-500 font-medium py-3 pl-2`}
                            >
                                {formatCurrency(order.price)}
                            </div>,
                            <div
                                key={order.quantity + 'qty'}
                                className="flex-1 py-3 hidden lg:block"
                            >
                                {formatCurrency(order.quantity)}
                            </div>,
                            <div
                                key={order.total + order.salt + i + 'total'}
                                className="flex-1 py-3"
                            >
                                <div
                                    style={{ width: `${barWidth}%` }}
                                    className={`absolute h-5 bg-${greenOrRed}-200 z-0`}
                                />
                                <div className={'z-10 relative'}>{formatCurrency(order.total)}</div>
                            </div>,
                        ]
                        return (
                            <div key={order.salt + i + 'row'} className={`flex hover:bg-gray-200`}>
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

import React, { useContext } from 'react'
import { formatCurrency, getTokenByAddress } from '@/utils'
import { OrderBookRow } from '@/hooks/useOrderBook'
import { PairContext } from '@/context/tokenPair'

interface OrderTableProps {
    orders: OrderBookRow[]
    type: 'bids' | 'asks'
}

const OrderTable = ({ orders, type }: OrderTableProps) => {
    const { quoteToken } = useContext(PairContext)

    const isBid = type === 'bids'
    const currentCurrency = getTokenByAddress(quoteToken)?.symbol
    const headers = ['Price', 'Quantity', 'Total']
    const greenOrRed = isBid ? 'green' : 'red'
    const gradient = isBid
        ? 'bg-gradient-to-r from-green-500 to-blue-500'
        : 'bg-gradient-to-r from-pink-500 to-red-500'
    return (
        <div className="flex-1 mr-4 block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden text-sm">
                <div className={`flex text-white font-bold ${gradient}`}>
                    {(isBid ? headers : headers.reverse()).map((header, i) => (
                        <div
                            key={header + false}
                            className={`flex-1 py-3 px-4 tracking-wider whitespace-nowrap ${
                                i === 1 ? 'hidden md:block' : ''
                            }`}
                        >
                            {header} ({currentCurrency})
                        </div>
                    ))}
                </div>
                {orders?.slice(0, 20).map((order, i, array) => {
                    const maxTotal = orders[array.length - 1].total
                    const curTotal = order.total
                    const arbMax = 90

                    const ratio = Math.round((curTotal / maxTotal) * arbMax)
                    const barWidth = ratio > arbMax ? arbMax : ratio === 0 ? 1 : ratio
                    const row = [
                        <div
                            key={order.price + 'price'}
                            className={`flex-1 text-${greenOrRed}-500 font-medium py-3`}
                        >
                            {formatCurrency(order.price)}
                        </div>,
                        <div key={order.quantity + 'qty'} className="flex-1 py-3 hidden md:block">
                            {formatCurrency(order.quantity)}
                        </div>,
                        <div
                            key={order.total + order.salt + i + 'total'}
                            className={`flex-1 py-3 ${
                                isBid ? 'transform -scale-x-100' : 'transform scale-x-100'
                            }`}
                        >
                            <div
                                style={{ width: `${barWidth}%` }}
                                className={`absolute h-5 bg-${greenOrRed}-200 z-0`}
                            />
                            <div
                                className={`z-10 relative ${
                                    isBid ? 'transform -scale-x-100' : 'transform scale-x-100'
                                }`}
                            >
                                {formatCurrency(order.total)}
                            </div>
                        </div>,
                    ]
                    return (
                        <div
                            key={order.salt + i + 'row'}
                            className={`flex hover:bg-gray-200 p${isBid ? 'l' : 'r'}-2`}
                        >
                            {isBid ? row : row.reverse()}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrderTable

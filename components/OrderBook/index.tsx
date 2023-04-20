import React, { useContext } from 'react'
import { OrderBookRow, useOrderBook } from '@/hooks/useOrderBook'
import { getNameByAddress } from '@/utils'
import { PairContext } from '@/context/tokenPair'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })

    const currentCurrency = getNameByAddress(quoteToken)

    const renderTable = (orders: OrderBookRow[], isBid: boolean) => {
        return (
            <div className="flex-1 pr-4">
                <h2 className="text-2xl font-semibold mb-2">{isBid ? 'Bids' : 'Asks'}</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Price ({currentCurrency})</th>
                            <th className="text-left">Quantity ({currentCurrency})</th>
                            <th className="text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.slice(0, 20).map((order, i) => (
                            <tr key={order.salt + i}>
                                <td className={`text-${isBid ? 'green' : 'red'}-500`}>
                                    {order.price}
                                </td>
                                <td>{order.quantity}</td>
                                <td>{order.total}</td>
                                {/*<td>*/}
                                {/*    {getNameByAddress(order.makerToken.toString()) ||*/}
                                {/*        order.makerToken.toString()}*/}
                                {/*</td>*/}
                                {/*<td>*/}
                                {/*    {getNameByAddress(order.takerToken.toString()) ||*/}
                                {/*        order.takerToken.toString()}*/}
                                {/*</td>*/}
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

import React, { useContext } from 'react'
import { Order } from '@/model/order'
import { useOrderBook } from '@/hooks/useOrderBook'
import { PairContext } from '@/pages'
import { considerDecimals, getCodeByAddress, getTokenByAddress } from '@/utils'

interface OrderBookRow extends Order {
    price: number
    quantity: number
    total: number
}

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { data } = useOrderBook({ baseToken, quoteToken })
    // useSubscription({ makerToken: baseToken, takerToken: quoteToken })

    const currentCurrency = getCodeByAddress(quoteToken)

    const bids: OrderBookRow[] =
        data?.bids?.records?.map((record: any) => {
            const order: Order = record.order
            const maker = getTokenByAddress(order.makerToken)
            const taker = getTokenByAddress(order.takerToken)
            const quantity = considerDecimals(order.makerAmount, maker?.decimals)
            const takerAmount = considerDecimals(order.takerAmount, taker?.decimals)
            const makerAmount = considerDecimals(order.makerAmount, maker?.decimals)
            const price = makerAmount / takerAmount

            return {
                ...order,
                price,
                quantity,
                total: 0,
            }
        }) || []

    const asks: OrderBookRow[] =
        data?.asks?.records?.map((record: any) => {
            const order: Order = record.order

            const maker = getTokenByAddress(order.makerToken)
            const taker = getTokenByAddress(order.takerToken)

            const makerDecimals = maker?.decimals
            const takerDecimals = taker?.decimals

            const quantity = considerDecimals(order.takerAmount, takerDecimals)

            const takerAmount = considerDecimals(order.takerAmount, takerDecimals)
            const makerAmount = considerDecimals(order.makerAmount, makerDecimals)
            const price = takerAmount / makerAmount

            return {
                ...order,
                price,
                quantity,
                total: 0,
            }
        }) || []

    const addTotal = (rows: OrderBookRow[]) =>
        rows.forEach((row, i) => {
            if (i === 0) {
                row.total = row.quantity
            } else {
                row.total = row.quantity + rows[i - 1].total
            }
        })

    addTotal(bids)
    addTotal(asks)

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
    )
}

export default OrderBook

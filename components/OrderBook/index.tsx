import React, { useContext } from 'react'
import { Order } from '@/model/order'
import { useOrderBook } from '@/hooks/useOrderBook'
import { PairContext } from '@/pages'
import { formatCurrency, getCodeByAddress, getTokenByAddress } from '@/utils'
import useSubscription from '@/hooks/useSubscription'

interface OrderBookRow extends Order {
    price: number
    quantity: number
    total: number
}

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { data } = useOrderBook({ baseToken, quoteToken })
    useSubscription({ makerToken: baseToken, takerToken: quoteToken })

    const currentCurrency = getCodeByAddress(quoteToken)

    const bids: OrderBookRow[] =
        data?.bids?.records
            ?.map((record: any) => {
                const order: Order = record.order
                const decimals = getTokenByAddress(order.makerToken)?.decimals
                const quantity = formatCurrency(order.makerAmount, decimals)
                const price = formatCurrency(order.takerAmount / order.makerAmount, decimals)

                const total = 0

                return {
                    ...order,
                    price,
                    quantity,
                    total,
                }
            })
            .reverse() || []

    bids.forEach((bid, i) => {
        if (i === 0) {
            bid.total = bid.quantity
        } else {
            bid.total = bid.quantity + bids[i - 1].total
        }
    })

    const asks: OrderBookRow[] =
        data?.asks?.records
            ?.map((record: any) => {
                const order: Order = record.order
                const decimals = getTokenByAddress(order.takerToken)?.decimals
                const quantity = formatCurrency(order.takerAmount, decimals)
                const price = formatCurrency(order.makerAmount / order.takerAmount, decimals)

                const total = 0

                return {
                    ...order,
                    price,
                    quantity,
                    total,
                }
            })
            .reverse() || []

    asks.forEach((ask, i) => {
        if (i === 0) {
            ask.total = ask.quantity
        } else {
            ask.total = ask.quantity + asks[i - 1].total
        }
    })

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

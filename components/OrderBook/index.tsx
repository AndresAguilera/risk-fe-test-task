import React, { useContext } from 'react'
import { useOrderBook } from '@/hooks/useOrderBook'
import { PairContext } from '@/pages'
import { getCodeByAddress } from '@/utils'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })
    // useSubscription({ makerToken: baseToken, takerToken: quoteToken })

    const currentCurrency = getCodeByAddress(quoteToken)

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

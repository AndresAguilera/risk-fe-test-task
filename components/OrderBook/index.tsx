import React, { useContext } from 'react'
import { useOrderBook } from '@/hooks/useOrderBook'
import { getCodeByAddress } from '@/utils'
import { PairContext } from '@/context/tokenPair'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })

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
                        {bids?.slice(0, 20).map((bid, i) => (
                            <tr key={bid.salt + i}>
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
                        {asks?.slice(0, 20).map((ask, i) => (
                            <tr key={ask.salt + i}>
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

import React, { useContext } from 'react'
import { useOrderBook } from '@/hooks/useOrderBook'
import { PairContext } from '@/context/tokenPair'
import OrderTable from '../OrderTable'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const { asks, bids } = useOrderBook({ baseToken, quoteToken })

    return (
        <div className="flex flex-row justify-between">
            <OrderTable orders={bids} type={'bids'} />
            <OrderTable orders={asks} type={'asks'} />
        </div>
    )
}

export default OrderBook

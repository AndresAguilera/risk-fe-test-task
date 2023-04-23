import React, { useContext, useState } from 'react'
import { useOrderBook } from '@/hooks/useOrderBook'
import { PairContext } from '@/context/tokenPair'
import OrderTable from '../OrderTable'
import Toggle from '@/components/Toggle'

const OrderBook: React.FC = () => {
    const { baseToken, quoteToken } = useContext(PairContext)
    const [showNonsense, setShowNonsense] = useState(false)
    const handleToggle = () => setShowNonsense((prevState) => !prevState)

    const { asks, bids } = useOrderBook({ baseToken, quoteToken, showNonsense })

    return (
        <div>
            <div className={'font-extralight text-sm italic text-gray-500 mb-2 my-2'}>
                <p>
                    *If you still want to have any update render on the table (even if it
                    doesn&apos;t correspond to the correct pair) and don&apos;t want to wait, you
                    can enable this toggle to have any order get added to the table.
                </p>
                <div className={'my-2'}>
                    <span className={'mr-4 italic'}>Show Nonsense</span>
                    <Toggle isOn={showNonsense} handleToggle={handleToggle} />
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <OrderTable orders={bids} type={'bids'} />
                <OrderTable orders={asks} type={'asks'} />
            </div>
        </div>
    )
}

export default OrderBook

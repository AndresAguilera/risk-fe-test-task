import React, { useState } from 'react'
import useSubscription from '@/hooks/useSubscription'
import { considerDecimals, formatCurrency, getTokenByAddress } from '@/utils'
import { OrderBookRow } from '@/hooks/useOrderBook'
import Toggle from '@/components/Toggle'

const LiveOrders = () => {
    const [onlyKnownTokens, setOnlyKnownTokens] = useState(false)
    const handleToggle = () => setOnlyKnownTokens((prevState) => !prevState)

    const orders: { order: OrderBookRow }[] = useSubscription({ onlyKnownTokens })
    const isLoading = orders.length === 0

    const order = orders[0]?.order
    const maker = getTokenByAddress(order?.makerToken)
    const taker = getTokenByAddress(order?.takerToken)
    // useToken(order?.takerToken)
    const makerSym = maker?.symbol || order?.makerToken
    const takerSym = taker?.symbol || order?.takerToken
    const makerAmount = formatCurrency(considerDecimals(order?.makerAmount, maker?.decimals))
    const takerAmount = formatCurrency(considerDecimals(order?.takerAmount, taker?.decimals))

    const orderData: { label: string; value: string | number; sym: string }[] = [
        {
            label: `Maker: `,
            value: makerAmount,
            sym: makerSym,
        },
        {
            label: `Taker: `,
            value: takerAmount,
            sym: takerSym,
        },
    ]
    return (
        <div>
            <div className={'font-extralight text-sm italic text-gray-500 mb-2'}>
                <p>
                    *The amount of messages received for a specific token pair from the web socket
                    is very low, so you may have to sit there a while to get a visual update. For
                    that, I have placed the Live Orders component below to display the orders
                    passed.
                </p>
                <p>*If the toggle is off, the symbol is only displayed if known (faster).</p>
                <p>*If the toggle is on, it will only display known token symbols (slower)</p>
            </div>
            <div className={'mb-2'}>
                <span className={'mr-4 italic'}>Show Only Known Tokens</span>
                <Toggle isOn={onlyKnownTokens} handleToggle={handleToggle} />
            </div>
            <h1 className={'font-bold'}>Live Orders</h1>
            {orderData.map(({ label, value, sym }, i) => (
                <span key={`label${i}`} className={'mr-4'}>
                    <span className={'font-bold'}>{label}</span>
                    <span>{!isLoading ? value : '-'}</span>
                    {sym && <span>({sym})</span>}
                </span>
            ))}
        </div>
    )
}

export default LiveOrders

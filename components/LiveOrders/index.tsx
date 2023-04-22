import React from 'react'
import useSubscription from '@/hooks/useSubscription'
import { considerDecimals, formatCurrency, getTokenByAddress } from '@/utils'
import { OrderBookRow } from '@/hooks/useOrderBook'

const LiveOrders = () => {
    const orders: { order: OrderBookRow }[] = useSubscription({})
    const order = orders[0]?.order
    const maker = getTokenByAddress(order?.makerToken)
    const taker = getTokenByAddress(order?.takerToken)
    const makerSym = maker?.symbol || order?.makerToken
    const takerSym = taker?.symbol || order?.takerToken
    const makerAmount = formatCurrency(considerDecimals(order?.makerAmount, maker?.decimals))
    const takerAmount = formatCurrency(considerDecimals(order?.takerAmount, taker?.decimals))

    const orderData: { label: string; value: string | number }[] = [
        {
            label: `maker: `,
            value: `${makerAmount} ${makerSym}`,
        },
        {
            label: `taker: `,
            value: `${takerAmount} ${takerSym}`,
        },
    ]
    return (
        <div>
            <h1>Live Orders</h1>
            {orderData.map(({ label, value }, i) => (
                <span key={`label${i}`} className={'mr-4'}>
                    {label} {value}
                </span>
            ))}
        </div>
    )
}

export default LiveOrders

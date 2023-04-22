import { tokens } from '@/data/mock'
import { Token } from '@/model/token'
import { Order } from '@/model/order'
import { OrderBookRow } from '@/hooks/useOrderBook'

export const getTokenByAddress = (address: string): Token | undefined =>
    tokens.find((tok: Token) => tok?.address?.toLowerCase() === address?.toLowerCase())

export const considerDecimals = (amount: number, decimals: number = 6) => amount / 10 ** decimals

export const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
    })
}

export const addTotal = (rows: OrderBookRow[]) =>
    rows.forEach((row, i) => {
        if (i === 0) {
            row.total = row.quantity
        } else {
            row.total = row.quantity + rows[i - 1].total
        }
    })
export const processRecords = (
    records: { order: Order; metadata?: any }[],
    isBid: boolean
): OrderBookRow[] => {
    const result =
        records
            ?.map((record: any) => {
                const order: Order = record.order
                const maker = getTokenByAddress(order.makerToken)
                const taker = getTokenByAddress(order.takerToken)
                const quantity = considerDecimals(
                    isBid ? order.makerAmount : order.takerAmount,
                    isBid ? maker?.decimals : taker?.decimals
                )
                const takerAmount = considerDecimals(order.takerAmount, taker?.decimals)
                const makerAmount = considerDecimals(order.makerAmount, maker?.decimals)
                const price = isBid ? makerAmount / takerAmount : takerAmount / makerAmount
                return {
                    ...order,
                    price,
                    quantity,
                    total: 0,
                }
            })
            .sort((a, b) => (!isBid ? a.price - b.price : b.price - a.price)) || []
    addTotal(result)
    return result
}

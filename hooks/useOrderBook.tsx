import { useQuery } from '@tanstack/react-query'
import { fetchOrderBook, FetchOrderBookArgs } from '@/data/api/0x'
import { Order } from '@/model/order'
import { considerDecimals, getTokenByAddress } from '@/utils'

export interface OrderBookRow extends Order {
    price: number
    quantity: number
    total: number
}

const addTotal = (rows: OrderBookRow[]) =>
    rows.forEach((row, i) => {
        if (i === 0) {
            row.total = row.quantity
        } else {
            row.total = row.quantity + rows[i - 1].total
        }
    })
export const useOrderBook = ({ baseToken, quoteToken }: FetchOrderBookArgs) => {
    const query = useQuery({
        queryKey: ['order book', baseToken, quoteToken],
        queryFn: () => fetchOrderBook({ baseToken, quoteToken }),
    })
    const bids: OrderBookRow[] =
        query.data?.bids?.records?.map((record: any) => {
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
        query.data?.asks?.records?.map((record: any) => {
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

    addTotal(bids)
    addTotal(asks)

    return { ...query, asks, bids }
}

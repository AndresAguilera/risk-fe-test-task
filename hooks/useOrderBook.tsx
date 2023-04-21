import { useQuery } from '@tanstack/react-query'
import { fetchOrderBook, FetchOrderBookArgs } from '@/data/api/0x'
import { Order } from '@/model/order'
import { considerDecimals, getTokenByAddress } from '@/utils'
import { useMemo } from 'react'
import useSubscription from '@/hooks/useSubscription'

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
export const processRecords = (
    records: { order: Order; metadata?: any }[],
    isBid: boolean,
    ws: boolean = false // TODO: used for testing for now, DELETE ME
): OrderBookRow[] =>
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
            if (ws) {
                // console.log(order.makerToken, order.takerToken)
            }
            return {
                ...order,
                price,
                quantity,
                total: 0,
            }
        })
        .sort((a, b) => (!isBid ? a.price - b.price : b.price - a.price)) || []

export const useOrderBook = ({ baseToken, quoteToken }: FetchOrderBookArgs) => {
    const query = useQuery({
        queryKey: ['order book', baseToken, quoteToken],
        queryFn: () => fetchOrderBook({ baseToken, quoteToken }),
        refetchOnWindowFocus: false,
    })

    useSubscription({ makerToken: baseToken, takerToken: quoteToken })

    const bids: OrderBookRow[] = useMemo(
        () => processRecords(query.data?.bids?.records, true),
        [query]
    )

    const asks: OrderBookRow[] = useMemo(
        () => processRecords(query.data?.asks?.records, false),
        [query]
    )

    addTotal(bids)
    addTotal(asks)

    return { ...query, asks, bids }
}

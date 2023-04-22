import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrderBook, FetchOrderBookArgs } from '@/data/api/0x'
import { Order } from '@/model/order'
import { considerDecimals, getTokenByAddress } from '@/utils'
import { useEffect, useMemo } from 'react'
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

export const useOrderBook = ({ baseToken, quoteToken }: FetchOrderBookArgs) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['order book', baseToken, quoteToken],
        queryFn: () => fetchOrderBook({ baseToken, quoteToken }),
        refetchOnWindowFocus: false,
    })

    const makerToken = baseToken
    const takerToken = quoteToken

    const orders = useSubscription({ makerToken, takerToken })

    useEffect(() => {
        if (orders.length) {
            const rTakerToken = orders[0]?.order.takerToken
            const rMakerToken = orders[0]?.order.makerToken
            const isBid = rMakerToken === makerToken && rTakerToken === takerToken

            const askOrBid = isBid ? 'bids' : 'asks'

            const queryKey = ['order book', makerToken, takerToken]
            queryClient.setQueriesData(queryKey, (oldData: any) => ({
                ...oldData,
                [askOrBid]: {
                    ...oldData[askOrBid],
                    records: [...oldData[askOrBid].records, ...orders],
                },
            }))
        }
    }, [orders, makerToken, takerToken, queryClient])

    const bids: OrderBookRow[] = useMemo(
        () => processRecords(query.data?.bids?.records, true),
        [query]
    )

    const asks: OrderBookRow[] = useMemo(
        () => processRecords(query.data?.asks?.records, false),
        [query]
    )

    return { ...query, asks, bids }
}

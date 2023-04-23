import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrderBook, FetchOrderBookArgs } from '@/data/api/0x'
import { Order } from '@/model/order'
import { useEffect, useMemo } from 'react'
import useSubscription from '@/hooks/useSubscription'
import { processRecords } from '@/utils'

export interface OrderBookRow extends Order {
    price: number
    quantity: number
    total: number
}

interface useOrderBookProps extends FetchOrderBookArgs {
    showNonsense?: boolean // used to display data that doesn't correspond with the selected token pair. Just to see render updates!
}

export const useOrderBook = ({ baseToken, quoteToken, showNonsense }: useOrderBookProps) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['order book', baseToken, quoteToken],
        queryFn: () => fetchOrderBook({ baseToken, quoteToken }),
        refetchOnWindowFocus: false,
    })

    const makerToken = baseToken
    const takerToken = quoteToken

    const orders = useSubscription({ makerToken, takerToken, showNonsense })

    useEffect(() => {
        if (orders.length) {
            const rTakerToken = orders[0]?.order.takerToken
            const rMakerToken = orders[0]?.order.makerToken
            const isBid = rMakerToken === makerToken && rTakerToken === takerToken

            const askOrBid = isBid ? 'bids' : 'asks'

            const queryKey = ['order book', makerToken, takerToken]
            queryClient.setQueriesData(queryKey, (oldData: any) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    [askOrBid]: {
                        ...oldData?.[askOrBid],
                        records: [...oldData?.[askOrBid].records, ...orders],
                    },
                }
            })
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

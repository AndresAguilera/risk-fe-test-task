import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OrderBookRow, processRecords } from '@/hooks/useOrderBook'

interface useSubscriptionProps {
    makerToken?: string
    takerToken?: string
}

interface SubscriptionMessage {
    type: 'subscribe'
    channel: 'orders'
    requestId?: string
    payload?: {
        makerToken?: string
        takerToken?: string
    }
}

const useSubscription = ({ makerToken, takerToken }: useSubscriptionProps) => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const websocket = new WebSocket(`wss://api.0x.org/orderbook/v1`)
        websocket.onopen = () => {
            console.log('Connected to WebSocket')
            const subscriptionMessage: SubscriptionMessage = {
                type: 'subscribe',
                channel: 'orders',
                requestId: uuidv4(),
                payload: { takerToken, makerToken },
            }
            websocket.send(JSON.stringify(subscriptionMessage))
        }
        websocket.onclose = (ev) => console.log('WebSocket connection closed', ev.code)
        websocket.onerror = (error) => console.error('WebSocket error:', error.type)

        websocket.onmessage = async (event) => {
            const records = JSON.parse(event.data).payload.filter(
                (record: any) => record?.metaData?.state === 'ADDED'
            )
            if (!records.length) return
            console.log(records[0])

            const rTakerToken = records[0]?.order.takerToken
            const rMakerToken = records[0]?.order.makerToken
            const isBid = rMakerToken === makerToken && rTakerToken === takerToken
            // const isBid = !!Math.round(Math.random())
            const askOrBid = isBid ? 'bids' : 'asks'

            const queryKey = ['order book', makerToken, takerToken]
            const processedRecords: OrderBookRow[] = processRecords(records, isBid, true)

            queryClient.setQueriesData(queryKey, (oldData: any) => ({
                ...oldData,
                [askOrBid]: {
                    ...oldData[askOrBid],
                    records: [
                        ...oldData[askOrBid].records,
                        ...processedRecords.map((r) => {
                            return { order: r }
                        }),
                    ],
                },
            }))
        }
        return () => websocket.close()
    }, [makerToken, takerToken, queryClient])
}

export default useSubscription

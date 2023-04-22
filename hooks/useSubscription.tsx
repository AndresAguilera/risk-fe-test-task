import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
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
    const [orders, setOrders] = useState<{ order: OrderBookRow }[]>([])

    useEffect(() => {
        const websocket = new WebSocket(`wss://api.0x.org/orderbook/v1`)
        websocket.onopen = () => {
            console.log('Connected to WebSocket. Waiting for messages...')
            const subscriptionMessage: SubscriptionMessage = {
                type: 'subscribe',
                channel: 'orders',
                requestId: uuidv4(),
                payload: {
                    ...(!!takerToken && { takerToken }),
                    ...(!!makerToken && { makerToken }),
                },
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

            const rTakerToken = records[0]?.order.takerToken
            const rMakerToken = records[0]?.order.makerToken
            const isBid = rMakerToken === makerToken && rTakerToken === takerToken
            // const isBid = !!Math.round(Math.random())

            const processedRecords: OrderBookRow[] = processRecords(records, isBid)
            const orders: { order: OrderBookRow }[] = processedRecords.map((r) => ({ order: r }))
            setOrders(orders)
        }
        return () => websocket.close()
    }, [makerToken, takerToken])
    return orders
}

export default useSubscription

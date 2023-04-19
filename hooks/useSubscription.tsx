import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Order } from '@/model/order'

interface useSubscriptionProps {
    makerToken?: string
    takerToken?: string
}

interface SubscriptionMessage {
    type: 'subscribe'
    channel: 'orders'
    requestId?: string
    payload?: {
        makerToken: string
        takerToken: string
    }
}

interface ResponseMessage {
    type: string
    channel: string
    payload: { order: Order; metadata: object }[]
    requestId: string
}

const useSubscription = ({ makerToken, takerToken }: useSubscriptionProps) => {
    const queryClient = useQueryClient()
    const [newRecords, setNewRecords] = useState()

    useEffect(() => {
        const websocket = new WebSocket(
            `wss://api.0x.org/orderbook/v1?makerToken=${makerToken}&takerToken=${takerToken}`
        )
        websocket.onopen = () => {
            console.log('Connected to WebSocket')
            const subscriptionMessage: SubscriptionMessage = {
                type: 'subscribe',
                channel: 'orders',
                requestId: uuidv4(),
            }
            websocket.send(JSON.stringify(subscriptionMessage))
        }
        websocket.onclose = (ev) => {
            console.log('WebSocket connection closed', ev.code)
        }
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error)
        }
        websocket.onmessage = async (event) => {
            const data = JSON.parse(event.data)
            const newRecords = data.payload
            setNewRecords(newRecords)
            const isBid = newRecords[0].order.takerToken === takerToken
            const askOrBid = isBid ? 'bids' : 'asks'
            console.log('new orders', newRecords[0].order.makerToken, isBid)
            const queryKey = ['order book', makerToken, takerToken]
            queryClient.setQueriesData(queryKey, (oldData: any) => ({
                ...oldData,
                [askOrBid]: {
                    ...oldData[askOrBid],
                    records: [...oldData[askOrBid].records, ...newRecords],
                },
            }))
        }
        return () => {
            websocket.close()
        }
    }, [makerToken, takerToken, queryClient])
    return newRecords
}

export default useSubscription

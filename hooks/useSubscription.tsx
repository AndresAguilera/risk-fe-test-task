import React, { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface useSubscriptionProps {
    makerToken?: string
    takerToken?: string
}

const useSubscription = ({ makerToken = '', takerToken = '' }: useSubscriptionProps) => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const websocket = new WebSocket(
            `wss://api.0x.org/orderbook/v1?makerToken=${makerToken}&takerToken=${takerToken}/`
        )
        websocket.onopen = (ev) => {
            console.log('connected', ev)
        }
        websocket.onclose = () => {
            console.log('closed')
        }
        websocket.onmessage = (event) => {
            console.log('msg', event)
            const data = JSON.parse(event.data)
            queryClient.setQueriesData(data, (oldData) => {
                console.log(data, oldData)
                return data
                // const update = (entity: any) =>
                //     entity.id === data.id ? { ...entity, ...data.payload } : entity
                // return Array.isArray(oldData) ? oldData.map(update) : update(oldData)
            })
        }

        return () => {
            websocket.close()
        }
    }, [queryClient])
}

export default useSubscription

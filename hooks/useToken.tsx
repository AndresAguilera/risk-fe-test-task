import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTokenInfo } from '@/data/api/ethplorer'

const useToken = (address: string) => {
    const { data } = useQuery(['token', address], () => fetchTokenInfo({ address }), {
        enabled: !!address,
        staleTime: 60 * 1000 * 10, // 10 mins
    })
    return data
}

export default useToken

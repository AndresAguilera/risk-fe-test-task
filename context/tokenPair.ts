import { createContext, Dispatch } from 'react'
import { tokens } from '@/data/mock'

const defaultValues: {
    baseToken: string
    quoteToken: string
    setBaseToken: Dispatch<any>
    setQuoteToken: Dispatch<any>
} = {
    quoteToken: tokens[0].address,
    baseToken: tokens[1].address,
    setBaseToken: () => {},
    setQuoteToken: () => {},
}

export const PairContext = createContext(defaultValues)

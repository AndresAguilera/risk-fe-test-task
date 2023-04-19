import PairSelector from '@/components/PairSelector'
import { useState } from 'react'
import { tokens } from '@/data/mock'
import OrderBook from '@/components/OrderBook'
import { PairContext } from '@/context/tokenPair'

export default function Home() {
    const [baseToken, setBaseToken] = useState<string>(tokens[0].address)
    const [quoteToken, setQuoteToken] = useState<string>(tokens[1].address)
    return (
        <PairContext.Provider
            value={{
                baseToken,
                quoteToken,
                setBaseToken,
                setQuoteToken,
            }}
        >
            <main>
                <div className="h-screen">
                    <OrderBook />
                    <PairSelector />
                </div>
            </main>
        </PairContext.Provider>
    )
}

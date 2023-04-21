import PairSelector from '@/components/PairSelector'
import { useState } from 'react'
import { tokens } from '@/data/mock'
import OrderBook from '@/components/OrderBook'
import { PairContext } from '@/context/tokenPair'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

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
            <main className={poppins.className}>
                <div className="container mx-auto">
                    <div className="flex flex-col space-y-4 md:space-y-8">
                        <PairSelector />
                        <OrderBook />
                    </div>
                </div>
            </main>
        </PairContext.Provider>
    )
}

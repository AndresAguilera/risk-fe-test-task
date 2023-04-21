import React, { FC, useContext } from 'react'
import Select from '@/components/PairSelector/Select'
import { PairContext } from '@/context/tokenPair'

interface PairSelectorProps {}

const PairSelector: FC<PairSelectorProps> = () => {
    const { quoteToken, baseToken, setBaseToken, setQuoteToken } = useContext(PairContext)

    return (
        <div className="flex flex-col space-y-8 items-center">
            <h1 className="text-2xl font-bold">Select a trading pair</h1>
            <div className="flex space-x-4 items-center">
                <div>
                    Base:
                    <Select
                        tokenAddress={baseToken}
                        onChange={(e) => setBaseToken(e.target.value)}
                    />
                </div>
                <div>
                    Quote:
                    <Select
                        tokenAddress={quoteToken}
                        onChange={(e) => setQuoteToken(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default PairSelector

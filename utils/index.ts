import { tokens } from '@/data/mock'
import { Token } from '@/model/token'

export const getNameByAddress = (address: string): string =>
    tokens.find((tok) => tok.address === address)?.name || ''

export const getTokenByAddress = (address: string): Token | undefined =>
    tokens.find((tok: Token) => tok.address.toLowerCase() === address.toLowerCase())

export const considerDecimals = (amount: number, decimals: number = 6) => amount / 10 ** decimals

export const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

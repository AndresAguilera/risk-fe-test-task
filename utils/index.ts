import { tokens } from '@/data/mock'
import { Token } from '@/model/token'

export const getCodeByAddress = (address: string): string =>
    tokens.find((tok) => tok.address === address)?.name || ''

export const getTokenByAddress = (address: string): Token | undefined =>
    tokens.find((tok: Token) => tok.address.toLowerCase() === address)

export const considerDecimals = (amount: number, decimals: number = 0) => amount / 10 ** decimals

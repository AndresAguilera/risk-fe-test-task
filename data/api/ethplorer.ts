import { getTokenByAddress } from '@/utils'

export interface fetchTokenInfoArgs {
    address: string
}

export const fetchTokenInfo = ({ address }: fetchTokenInfoArgs) => {
    const localToken = getTokenByAddress(address)
    return (
        localToken ??
        fetch(`https://api.ethplorer.io/getTokenInfo/${address}?apiKey=freekey`).then((res) =>
            res.json()
        )
    )
}

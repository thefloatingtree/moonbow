import distinctColors from 'distinct-colors'

export const colors = distinctColors
    .default({ count: 16 })
    .map(color => color.hex())

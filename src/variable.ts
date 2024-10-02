export type Variable = {
    group: string,
    tone: number,
    hex: string
    source?: 'nala' | 'generated'
}

export const allowedGroups = [
    'primitive',
    'primary',
    'secondary',
    'tertiary',
    'neutral',
    'neutral-variant',
    'neutralVariant'
]

export const hexToSkia = (hex: string) => {
    if (hex.length === 3 || hex.length === 4) {
        hex = Array.from(hex).map(r => r + r).join('')
    }

    const result: string[] = []
    const stride = hex.length < 6 ? 1 : 2
    for (let i = 0; i < hex.length; i += stride) {
        result.push(hex.slice(i, i + stride))
    }

    const ctor = result.length % 4 === 2 ? 'SkColorSetARGB' : 'SkColorSetRGB'
    return `${ctor}(${result.map(r => `0x${r}`).join(',')})`
}

const getChromiumName = (variable: Variable) => `kColorRef${variable.group[0].toUpperCase() + variable.group.slice(1)}${variable.tone}`
export const variableToColorRef = (variable: Variable) => {
    return `mixer[${getChromiumName(variable)}] = {${hexToSkia(variable.hex)}};`
}

export const deduplicatePreferringNala = ({ nala, chromium }: { nala: Variable[], chromium: Variable[] }) => {
    const nalaVariables = new Set<string>(nala.map(n => getChromiumName(n)))
    return [...nala].concat(chromium.filter(v => !nalaVariables.has(getChromiumName(v)))).sort((a, b) => {
        if (a.group === b.group) {
            return a.tone - b.tone
        }
        return a.group.localeCompare(b.group)
    })
}

import { themeFromSourceColor, argbFromHex, hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import { allowedGroups, Variable } from './variable'

type AvailableVariable = Omit<Variable, 'hex'>

type Theme = {
    primary: string
    neutral: string
}

export const fetchChromiumVariables = async (): Promise<AvailableVariable[]> => {
    const text = await fetch('https://raw.githubusercontent.com/brave/chromium/main/ui/color/color_id.h').then(r => r.text())
    const regex = /E_CPONLY\(kColorRef(?<group>[a-zA-Z]+)(?<tone>\d+(,|\)))/gm

    return Array.from(text.matchAll(regex)).map(r => ({
        group: r.groups!.group[0].toLowerCase() + r.groups!.group.slice(1),
        tone: parseInt(r.groups!.tone)
    }))
        .filter(r => allowedGroups.includes(r.group))
}

export const getValuesFor = ({primary, neutral}: Theme, variables: AvailableVariable[]): Variable[] => {
    const primaryN = argbFromHex(primary)
    const neutralN = argbFromHex(neutral)
    const palette = themeFromSourceColor(primaryN)
    palette.palettes.neutral = TonalPalette.fromInt(neutralN)
    palette.palettes.neutralVariant = TonalPalette.fromInt(argbFromHex('#818FBA'))

    return variables.map(v => ({
        ...v,
        hex: hexFromArgb(palette.palettes[v.group].tone(v.tone)).slice(1),
        source: 'generated'
    }))
}

import { themeFromSourceColor, argbFromHex, hexFromArgb } from '@material/material-color-utilities'
import { allowedGroups, Variable } from './variable'

type AvailableVariable = Omit<Variable, 'hex'>

export const fetchChromiumVariables = async (): Promise<AvailableVariable[]> => {
    const text = await fetch('https://raw.githubusercontent.com/brave/chromium/main/ui/color/color_id.h').then(r => r.text())
    const regex = /E_CPONLY\(kColorRef(?<group>[a-zA-Z]+)(?<tone>\d+(,|\)))/gm

    return Array.from(text.matchAll(regex)).map(r => ({
        group: r.groups!.group[0].toLowerCase() + r.groups!.group.slice(1),
        tone: parseInt(r.groups!.tone)
    }))
        .filter(r => allowedGroups.includes(r.group))
}

export const getValuesFor = (theme: string, variables: AvailableVariable[]): Variable[] => {
    const palette = themeFromSourceColor(argbFromHex(theme))
    return variables.map(v => ({
        ...v,
        hex: hexFromArgb(palette.palettes[v.group].tone(v.tone)).slice(1)
    }))
}

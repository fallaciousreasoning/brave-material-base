import { allowedGroups, Variable } from "./variable"

export const fetchNalaVariables = async () => {
    const corsProxiedURL = 'https://corsproxy.io/?https%3A%2F%2Fnala.bravesoftware.com%2Fcss%2Fvariables.css'
    const text = await fetch(corsProxiedURL).then(r => r.text())
    const variablesRegex = /--leo-color-primitive-(?<group>[a-z\-]+)-(?<tone>\d+): #(?<hex>[0-9A-Fa-f]+);/gm
    const results: Variable[] = []
    for (const match of text.matchAll(variablesRegex)) {
        const { group, tone, hex } = match.groups!
        if (!allowedGroups.includes(group)) continue
        results.push({
            group: group.replace('-variant', 'Variant'),
            hex,
            tone: parseInt(tone),
            source: 'nala'
        })
    }

    return results
}

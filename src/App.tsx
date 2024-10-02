import { useEffect, useMemo, useState } from 'react'
import { fetchNalaVariables } from './nalaVariables'
import { variableToColorRef, deduplicatePreferringNala } from './variable'
import { fetchChromiumVariables, getValuesFor } from './chromiumVariables'

function usePromise<T>(promise: () => Promise<T>) {
  const [result, setResult] = useState<T>()
  useEffect(() => {
    promise().then(setResult)
  }, [])

  return result
}


function App() {
  const [primary, setPrimary] = useState('#6261FF')
  const [neutral, setNeutral] = useState('#76767a')
  const nalaVariables = usePromise(fetchNalaVariables) ?? []
  const chromiumVariables = usePromise(fetchChromiumVariables) ?? []
  const chromiumWithValue = useMemo(() => getValuesFor(neutral, chromiumVariables), [neutral, chromiumVariables])
  const deduplicated = useMemo(() => deduplicatePreferringNala({ nala: nalaVariables, chromium: chromiumWithValue }), [nalaVariables, chromiumVariables])
  return <div>
  <label>
    Primary
    <input pattern='#([a-fA-F0-9]{6})' value={primary} onChange={e => setPrimary(e.target.value)} />
  </label>
    <label>
      Neutral
      <input pattern='#([a-fA-F0-9]{6})' value={neutral} onChange={e => setNeutral(e.target.value)} />
    </label>
    <pre>
      {deduplicated.map(r => variableToColorRef(r) + " // " + r.source).join('\n')}
    </pre>
  </div>
}

export default App

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
  const [theme, setTheme] = useState('#76767a')
  const nalaVariables = usePromise(fetchNalaVariables) ?? []
  const chromiumVariables = usePromise(fetchChromiumVariables) ?? []
  const chromiumWithValue = useMemo(() => getValuesFor(theme, chromiumVariables), [theme, chromiumVariables])
  const deduplicated = useMemo(() => deduplicatePreferringNala({ nala: nalaVariables, chromium: chromiumWithValue }), [nalaVariables, chromiumVariables])
  return <div>
    <label>
      Theme
      <input value={theme} onChange={e => setTheme(e.target.value)} />
    </label>
    <pre>
      {deduplicated.map(r => variableToColorRef(r)).join('\n')}
    </pre>
  </div>
}

export default App

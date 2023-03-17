import { createContext, useContext, useEffect, useState } from 'react'

import { loadPyodide, PyodideInterface } from 'pyodide'

interface Pyodide {
  pyodide?: PyodideInterface
}

const PyodideContext = createContext<Pyodide>({})

export const usePyodide = () => useContext(PyodideContext)

interface Props {
  children: React.ReactNode
}

export const PyodideProvider = ({ children }: Props) => {
  const [pyodide, setPyodide] = useState<PyodideInterface | undefined>()

  useEffect(() => {
    const downloadPyodide = async () => {
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/',
      })
      const buffer = await (await fetch('/utils.whl')).arrayBuffer()
      await pyodide.unpackArchive(buffer, 'wheel')
      pyodide.pyimport('utils')
      setPyodide(pyodide)
    }

    if (!pyodide) {
      downloadPyodide()
    }
  }, [pyodide])

  return (
    <PyodideContext.Provider value={{ pyodide }}>
      {children}
    </PyodideContext.Provider>
  )
}

import { loadPyodide, PyodideInterface } from 'pyodide'

declare global {
  interface Window {
    pyodide: PyodideInterface
  }
}

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.22.1/full/',
  })
  const buffer = await (await fetch('/utils.whl')).arrayBuffer()
  await self.pyodide.unpackArchive(buffer, 'wheel')
  self.pyodide.pyimport('utils')
}

const pyodidePromise = loadPyodideAndPackages()

self.onmessage = async (event) => {
  await pyodidePromise
  const { code, board } = event.data
  try {
    await self.pyodide.runPythonAsync(
      code +
        '\n' +
        `
import os, sys

if __name__ == '__main__':
  old_stdout = sys.stdout
  old_stderr = sys.stderr
  sys.stdout = open(os.devnull, 'w')
  sys.stderr = open(os.devnull, 'w')

  move = None
  try:
      move = PlayerAI().make_move(${JSON.stringify(board)})
      move = str(list(move))
  except Exception as e:
      pass
  finally:
      sys.stdout = old_stdout
      sys.stderr = old_stderr
`
    )

    if (!self.pyodide.globals.get('move')) {
      throw new Error('Failed to get move from bot')
    }

    self.postMessage({ move: JSON.parse(self.pyodide.globals.get('move')) })
  } catch (e) {
    self.postMessage({ error: (e as Error).message })
  }
}

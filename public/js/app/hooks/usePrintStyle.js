import { useEffect, useState, useCallback, useMemo } from 'react'

export const usePrintStyle = () => {
  const [printStyle, setPrintStyle] = useState(false)
  let globalWindow = {}
  const isClientSide = typeof window !== 'undefined'
  if (isClientSide) {
    globalWindow = window
  }

  //   useEffect(() => {
  //     globalWindow.onbeforeprint = ('beforeprint', () => ) => {
  //       console.log('beforeprint')
  //       setPrintStyle(true)
  //     }

  //     globalWindow.onafterprint = () => {
  //       console.log('afterprint')

  //       setPrintStyle(false)
  //     }
  //   }, [globalWindow])

  useEffect(() => {
    const handleBeforePrint = () => setPrintStyle(true)
    globalWindow.addEventListener('beforeprint', handleBeforePrint)
    return () => {
      globalWindow.removeEventListener('beforeprint', handleBeforePrint)
    }
  }, [globalWindow])

  useEffect(() => {
    const handleAfterPrint = () => setPrintStyle(false)
    globalWindow.addEventListener('afterprint', handleAfterPrint)
    return () => {
      globalWindow.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [globalWindow])

  // setTimeout used to queue rendering of print styles before printing
  const printDialog = useCallback(() => setTimeout(() => globalWindow.print()), [globalWindow])

  //   return { printStyle, printDialog }
  return useMemo(() => ({ printStyle, printDialog }), [printStyle, printDialog])
}

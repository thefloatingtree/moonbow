import { useEffect, useRef } from 'react'
import { izzy } from './izzy/main'

function App() {
  const canvasRef = useRef()

  useEffect(() => {
    izzy.init(canvasRef.current)
  }, [ canvasRef ])

  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default App

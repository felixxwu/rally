import React from 'react'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense, useMemo } from 'react'
import { Experience } from './components/Experience'

export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  jump: 'jump',
}

function App() {
  const [speed, setSpeed] = React.useState(0)
  const [debug, setDebug] = React.useState(true)

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
    ],
    []
  )

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ fov: 60 }}>
          <color attach='background' args={['#ececec']} />
          <Suspense>
            <Physics>
              <Experience setSpeed={setSpeed} debug={debug} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <h1 style={{ color: 'black', position: 'fixed', bottom: 0 }}>{Math.round(speed * 100)}</h1>
      <h1 style={{ color: 'black', position: 'fixed', top: 0 }} onClick={() => setDebug(!debug)}>
        Debug: {`${debug}`}
      </h1>
    </>
  )
}

export default App

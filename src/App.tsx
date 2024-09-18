import React from 'react'
import { KeyboardControls, OrbitControls } from '@react-three/drei'
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
  // const [speed, setSpeed] = React.useState(0)
  const [debug, setDebug] = React.useState(true)
  const [mobileControls, setMobileControls] = React.useState(false)
  const [left, setLeft] = React.useState(false)
  const [right, setRight] = React.useState(false)
  const [forward, setForward] = React.useState(false)
  const [back, setBack] = React.useState(false)

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
            <Physics debug={debug} colliders='trimesh'>
              <Experience debug={debug} left={left} right={right} forward={forward} back={back} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      {/* <h1 style={{ color: 'black', position: 'fixed', bottom: 0 }}>{Math.round(speed * 100)}</h1> */}
      <h2 style={{ color: 'black', position: 'fixed', top: 0 }} onClick={() => setDebug(!debug)}>
        Debug: {`${debug}`}
      </h2>
      <h2
        style={{ color: 'black', position: 'fixed', top: '30px' }}
        onClick={() => setMobileControls(!mobileControls)}
      >
        Mobile controls: {`${mobileControls}`}
      </h2>
      {mobileControls && (
        <div
          style={{
            height: '100px',
            position: 'fixed',
            bottom: 0,
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ width: '80px', height: '80px', backgroundColor: '#fff7' }}
            onPointerDown={() => setLeft(true)}
            onPointerUp={() => setLeft(false)}
            onPointerLeave={() => setLeft(false)}
          />
          <div
            style={{ width: '80px', height: '80px', backgroundColor: '#fff7' }}
            onPointerDown={() => setRight(true)}
            onPointerUp={() => setRight(false)}
            onPointerLeave={() => setRight(false)}
          />
          <div
            style={{ width: '80px', height: '80px', backgroundColor: '#fff7' }}
            onPointerDown={() => setBack(true)}
            onPointerUp={() => setBack(false)}
            onPointerLeave={() => setBack(false)}
          />
          <div
            style={{ width: '80px', height: '80px', backgroundColor: '#fff7' }}
            onPointerDown={() => setForward(true)}
            onPointerUp={() => setForward(false)}
            onPointerLeave={() => setForward(false)}
          />
        </div>
      )}
    </>
  )
}

export default App

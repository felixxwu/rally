import React from 'react'
import { Box, Sky, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody, RigidBody, RoundCuboidCollider } from '@react-three/rapier'
import { useRef } from 'react'
import { Controls } from '../App'
import * as THREE from 'three'
import Terrain from './Terrain'

const power = 0.3
const maxTireForce = 0.6
const steer = 0.06
const airResistanceScale = 0.5
const spawnPos = new THREE.Vector3(50, 20, 0)
const reverseOppositeSteerCutoff = 0.8
const speedSteerCutoff = 0.01
const cameraLerp = 10
const cameraDistance = 10
const cameraHeight = 5
const debugArrowSize = 10
const tireSnappiness = 15

export const Experience = ({
  // setSpeed,
  debug,
  left,
  right,
  forward,
  back,
}: {
  // setSpeed: (speed: number) => void
  debug: boolean
  left: boolean
  right: boolean
  forward: boolean
  back: boolean
}) => {
  const cube = useRef<RapierRigidBody | null>(null)
  const directionOfTravelArrow = useRef<THREE.ArrowHelper | null>(null)
  const sideForceArrow = useRef<THREE.ArrowHelper | null>(null)
  const airResistanceArrow = useRef<THREE.ArrowHelper | null>(null)
  const carForceArrow = useRef<THREE.ArrowHelper | null>(null)

  const oldPos = useRef(spawnPos.clone())
  const isOnFloor = useRef(true)

  const spacePressed = useKeyboardControls(state => state[Controls.jump])
  const leftPressed = useKeyboardControls(state => state[Controls.left]) || left
  const rightPressed = useKeyboardControls(state => state[Controls.right]) || right
  const backPressed = useKeyboardControls(state => state[Controls.back]) || back
  const forwardPressed = useKeyboardControls(state => state[Controls.forward]) || forward

  const handleMovement = (
    tireForce: THREE.Vector3,
    airResistance: THREE.Vector3,
    angle: number,
    speed: number
  ) => {
    if (!isOnFloor.current || !cube.current) {
      sideForceArrow.current?.setLength(0)
      carForceArrow.current?.setLength(0)
      return
    }
    const steerTorque =
      speed < speedSteerCutoff ? 0 : angle > reverseOppositeSteerCutoff ? -steer : steer
    if (rightPressed) {
      cube.current.applyTorqueImpulse({ x: 0, y: steerTorque, z: 0 }, true)
    }
    if (leftPressed) {
      cube.current.applyTorqueImpulse({ x: 0, y: -steerTorque, z: 0 }, true)
    }

    const carForce = new THREE.Vector3(0, 0, 0)
    carForce.add(tireForce)

    if (forwardPressed && !spacePressed) {
      const engineForce = new THREE.Vector3(0, 0, -power)
      engineForce.applyQuaternion(cube.current.rotation())
      engineForce.clampLength(0, maxTireForce)
      carForce.add(engineForce)
    }

    if (backPressed && !spacePressed) {
      const brakeForce = new THREE.Vector3(0, 0, power)
      brakeForce.applyQuaternion(cube.current.rotation())
      carForce.add(brakeForce)
    }

    carForce.clampLength(0, maxTireForce)

    const { x, y, z } = cube.current.translation()
    carForceArrow.current?.position.set(x, y + 1, z)
    carForceArrow.current?.setDirection(carForce)
    carForceArrow.current?.setLength(carForce.length() * debugArrowSize)
    carForceArrow.current?.setColor(new THREE.Color(0xff0000))

    carForce.add(airResistance)

    cube.current.applyImpulse(carForce, true)
  }

  useFrame((_state, delta) => {
    if (!cube.current) return

    const { x, y, z } = cube.current.translation()
    const carPos = new THREE.Vector3(x, y, z)
    const rotation = cube.current.rotation()

    const forwardVec = new THREE.Vector3(0, 0, cameraDistance)
    forwardVec.applyQuaternion(rotation)
    const cameraPos = carPos
      .clone()
      .add(forwardVec.clone())
      .add(new THREE.Vector3(0, cameraHeight, 0))
    // _state.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    _state.camera.position.lerp(cameraPos, delta * cameraLerp)
    _state.camera.lookAt(carPos.clone())
    _state.camera.updateProjectionMatrix()

    const directionOfTravel = carPos.clone().sub(oldPos.current)
    const speed = directionOfTravel.length()
    // setSpeed(speed)

    const angle = directionOfTravel.angleTo(forwardVec)
    const straightAhead = new THREE.Vector3(0, 0, -1)
    straightAhead.applyQuaternion(rotation)

    const sideForce = new THREE.Vector3(-1, 0, 0)
    sideForce.applyQuaternion(rotation)

    const projected = directionOfTravel.clone().projectOnVector(sideForce)
    const sideTireForce = projected.multiplyScalar(-tireSnappiness).clampLength(0, maxTireForce)
    const tireForce = spacePressed
      ? directionOfTravel.clone().multiplyScalar(-tireSnappiness).clampLength(0, maxTireForce)
      : sideTireForce

    const airResistance = directionOfTravel
      .clone()
      .multiplyScalar(directionOfTravel.length() * -airResistanceScale)

    directionOfTravelArrow.current?.position.set(x, y + 1, z)
    directionOfTravelArrow.current?.setDirection(directionOfTravel)
    directionOfTravelArrow.current?.setLength(speed * debugArrowSize)
    directionOfTravelArrow.current?.setColor(new THREE.Color(0x0000ff))

    sideForceArrow.current?.position.set(x, y + 1, z)
    sideForceArrow.current?.setDirection(tireForce)
    sideForceArrow.current?.setLength(tireForce.length() * debugArrowSize)
    sideForceArrow.current?.setColor(new THREE.Color(0x000000))

    airResistanceArrow.current?.position.set(x, y + 1, z)
    airResistanceArrow.current?.setDirection(airResistance.clone())
    airResistanceArrow.current?.setLength(airResistance.length() * debugArrowSize)
    airResistanceArrow.current?.setColor(new THREE.Color(0xffffff))

    handleMovement(tireForce, airResistance, angle, speed)

    oldPos.current.set(x, y, z)
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[-10, 2, 0]} intensity={1} />

      <RigidBody
        position={spawnPos}
        ref={cube}
        angularDamping={3}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === 'floor') {
            isOnFloor.current = true
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject?.name === 'floor') {
            isOnFloor.current = false
          }
        }}
      >
        <Box args={[1, 0.5, 2]}>
          <RoundCuboidCollider args={[0.5, 0.25, 1, 0.2]} />
          <meshStandardMaterial color='white' />
        </Box>
      </RigidBody>

      {debug && (
        <>
          <arrowHelper ref={directionOfTravelArrow} />
          <arrowHelper ref={airResistanceArrow} />
          <arrowHelper ref={carForceArrow} />
          <arrowHelper ref={sideForceArrow} />
        </>
      )}

      {/* {[...Array(60)].map((_, z) => (
        <RigidBody type='fixed' position={[0, 0.75, 0]} key={z}>
          <group position={[2.5, 0, z * 10 - 300]}>
            <Box args={[5, 1, 0.5]}>
              <meshStandardMaterial color='peachpuff' />
            </Box>
          </group>
        </RigidBody>
      ))} */}

      <RigidBody type='fixed' name='floor' friction={0}>
        {/* <Box position={[0, 0, 0]} args={[50, 1, 600]}>
          <meshStandardMaterial color='springgreen' />
        </Box> */}
        <Terrain seed={0} size={70} height={0.04} levels={2} scale={1} offset={{ x: 0, z: 0 }} />
      </RigidBody>

      <Sky />
    </>
  )
}

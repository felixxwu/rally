import { constant, onRender, scene } from '../../constant'
import { THREE } from '../utils/THREE'
import { updateWheel } from './updateWheel'

export const springLength = 1.3
export const sprintRate = 200
export const springDamping = 3000
export const wheelRadius = 0.4

export function initWheel(front: boolean, left: boolean) {
  let prevDistance = constant(springLength)

  const suspensionArrow = new THREE.ArrowHelper()
  suspensionArrow.setDirection(new THREE.Vector3(0, 1, 0))
  scene.current?.add(suspensionArrow)

  const slipArrow = new THREE.ArrowHelper()
  slipArrow.setColor('black')
  scene.current?.add(slipArrow)

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  )

  scene.current?.add(wheelMesh)

  onRender.push(deltaTime => {
    updateWheel(deltaTime, wheelMesh, suspensionArrow, slipArrow, prevDistance, front, left)
  })
}

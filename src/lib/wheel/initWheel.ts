import { constant, onRender, scene } from '../../constant'
import { THREE } from '../utils/THREE'
import { updateWheel } from './updateWheel'

export const springLength = 1.3
export const sprintRate = 2.3
export const springDamping = 70
export const wheelRadius = 0.4

export function initWheel(front: boolean, left: boolean) {
  let prevDistance = constant(springLength)
  const wheelArrow = new THREE.ArrowHelper()
  wheelArrow.setDirection(new THREE.Vector3(0, 1, 0))
  scene.current?.add(wheelArrow)

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  )

  scene.current?.add(wheelMesh)

  onRender.push(deltaTime => {
    updateWheel(deltaTime, wheelMesh, wheelArrow, prevDistance, front, left)
  })
}

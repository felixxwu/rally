export const arrow = constant<THREE.ArrowHelper | null>(null)

import { constant, onRender, scene } from '../../constant'
import { updateHelperArrows } from './updateHelperArrows'
import { THREE } from '../utils/THREE'

export function initHelperArrows() {
  arrow.current = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 5, 0),
    5,
    0xffff00
  )
  scene.current?.add(arrow.current)

  onRender.push(updateHelperArrows)
}

export const arrow = constant<THREE.ArrowHelper | null>(null)

import { constant, onRender, scene } from '../../constant'
import { updateHelperArrows } from './updateHelperArrows'
import { THREE } from '../utils/THREE'

export function initHelperArrows() {
  arrow.current = new THREE.ArrowHelper()
  arrow.current.setColor(0xff0000)
  scene.current?.add(arrow.current)

  onRender.push(updateHelperArrows)
}

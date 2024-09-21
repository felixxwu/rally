import { constant, onRender, scene } from '../../constant'
import { updateHelperArrows } from './updateHelperArrows'
import { THREE } from '../utils/THREE'

export const travelArrow = constant<THREE.ArrowHelper | null>(null)

export function initHelperArrows() {
  travelArrow.current = new THREE.ArrowHelper()
  travelArrow.current.setColor(0x0000ff)
  scene.current?.add(travelArrow.current)

  onRender.push(updateHelperArrows)
}

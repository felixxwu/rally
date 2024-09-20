import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType
import * as THREE from 'three'

import { arrow, scene } from '../constant'

export function initHelperArrows() {
  const dir = new THREE.Vector3(5, 5, 0)

  const origin = new THREE.Vector3(0, 5, 0)
  const hex = 0xffff00

  arrow.current = new THREE.ArrowHelper(dir.normalize(), origin, 5, hex)
  scene.current?.add(arrow.current)
}

import AmmoType from 'ammojs-typed'
import * as THREE from 'three'
import { camera, onRender, renderer } from '../../constant'
import { updateCamera } from './updateCamera'
declare const Ammo: typeof AmmoType

export function initCamera() {
  camera.current = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  )

  onRender.push(updateCamera)

  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  if (!camera.current) return

  camera.current.aspect = window.innerWidth / window.innerHeight
  camera.current.updateProjectionMatrix()

  renderer.current?.setSize(window.innerWidth, window.innerHeight)
}

import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType
import * as THREE from 'three'
import { scene } from '../constant'

export const initLight = () => {
  const ambientLight = new THREE.AmbientLight(0xbbbbbb)
  scene.current?.add(ambientLight)

  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(100, 100, 50)
  light.castShadow = true
  const dLight = 200
  const sLight = dLight * 0.25
  light.shadow.camera.left = -sLight
  light.shadow.camera.right = sLight
  light.shadow.camera.top = sLight
  light.shadow.camera.bottom = -sLight

  light.shadow.camera.near = dLight / 30
  light.shadow.camera.far = dLight

  light.shadow.mapSize.x = 1024 * 2
  light.shadow.mapSize.y = 1024 * 2

  scene.current?.add(light)
}

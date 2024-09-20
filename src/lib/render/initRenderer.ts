import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType
import * as THREE from 'three'

import { container, renderer, stats, clock, time, scene, camera, onRender } from '../../constant'

export function initRenderer() {
  renderer.current = new THREE.WebGLRenderer({ antialias: true })
  renderer.current.setPixelRatio(window.devicePixelRatio)
  renderer.current.setSize(window.innerWidth, window.innerHeight)
  renderer.current.setAnimationLoop(animate)
  renderer.current.shadowMap.enabled = true
  container.current?.appendChild(renderer.current.domElement)
}

function animate() {
  const deltaTime = clock.getDelta()
  onRender.forEach(callback => callback(deltaTime))

  renderer.current?.render(scene.current!, camera.current!)

  time.current += deltaTime

  stats.current.update()
}

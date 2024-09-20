import AmmoType from 'ammojs-typed'
import * as THREE from 'three'
declare const Ammo: typeof AmmoType

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { container, scene, stats } from '../constant'

export function initGraphics() {
  container.current = document.getElementById('container')

  stats.current = new Stats()
  stats.current.domElement.style.position = 'absolute'
  stats.current.domElement.style.top = '0px'
  container.current?.appendChild(stats.current.domElement)

  scene.current = new THREE.Scene()
  scene.current.background = new THREE.Color(0xbfd1e5)
}

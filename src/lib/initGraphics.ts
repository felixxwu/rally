import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { render } from './render'
import {
  camera,
  container,
  heightData,
  renderer,
  scene,
  stats,
  terrainDepth,
  terrainDepthExtents,
  terrainHalfDepth,
  terrainHalfWidth,
  terrainMaxHeight,
  terrainMesh,
  terrainMinHeight,
  terrainWidth,
  terrainWidthExtents,
} from '../constant'
import * as THREE from 'three'
import { OrbitControls } from './jsm/OrbitControls'

export function initGraphics() {
  container.current = document.getElementById('container')

  renderer.current = new THREE.WebGLRenderer({ antialias: true })
  renderer.current.setPixelRatio(window.devicePixelRatio)
  renderer.current.setSize(window.innerWidth, window.innerHeight)
  renderer.current.setAnimationLoop(animate)
  renderer.current.shadowMap.enabled = true
  container.current?.appendChild(renderer.current.domElement)

  stats.current = new Stats()
  stats.current.domElement.style.position = 'absolute'
  stats.current.domElement.style.top = '0px'
  container.current?.appendChild(stats.current.domElement)

  camera.current = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  )

  scene.current = new THREE.Scene()
  scene.current.background = new THREE.Color(0xbfd1e5)

  camera.current.position.y =
    (heightData.current?.[terrainHalfWidth + terrainHalfDepth * terrainWidth] ?? 0) *
      (terrainMaxHeight - terrainMinHeight) +
    5

  camera.current.position.z = terrainDepthExtents / 2
  camera.current.lookAt(0, 0, 0)

  const controls = new OrbitControls(camera.current, renderer.current.domElement)
  controls.enableZoom = false

  const geometry = new THREE.PlaneGeometry(
    terrainWidthExtents,
    terrainDepthExtents,
    terrainWidth - 1,
    terrainDepth - 1
  )
  geometry.rotateX(-Math.PI / 2)

  const vertices = geometry.attributes.position.array

  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    // j + 1 because it is the y component that we modify
    vertices[j + 1] = heightData.current?.[i] ?? 0
  }

  geometry.computeVertexNormals()

  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xc7c7c7 })
  terrainMesh.current = new THREE.Mesh(geometry, groundMaterial)
  terrainMesh.current.receiveShadow = true
  terrainMesh.current.castShadow = true

  scene.current.add(terrainMesh.current)

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('./grid.png', function (texture) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(terrainWidth - 1, terrainDepth - 1)
    groundMaterial.map = texture
    groundMaterial.needsUpdate = true
  })

  const ambientLight = new THREE.AmbientLight(0xbbbbbb)
  scene.current.add(ambientLight)

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

  scene.current.add(light)

  window.addEventListener('resize', onWindowResize)
}

function animate() {
  render()
  stats.current.update()
}

function onWindowResize() {
  if (!camera.current) return

  camera.current.aspect = window.innerWidth / window.innerHeight
  camera.current.updateProjectionMatrix()

  renderer.current?.setSize(window.innerWidth, window.innerHeight)
}

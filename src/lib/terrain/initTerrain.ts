import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType
import * as THREE from 'three'
import {
  heightData,
  scene,
  terrainDepth,
  terrainDepthExtents,
  terrainMaxHeight,
  terrainMesh,
  terrainMinHeight,
  terrainWidth,
  terrainWidthExtents,
} from '../../constant'
import { generateHeight } from './generateHeight'

export function initTerrain() {
  heightData.current = generateHeight(
    terrainWidth,
    terrainDepth,
    terrainMinHeight,
    terrainMaxHeight
  )

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

  scene.current?.add(terrainMesh.current)

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('./grid.png', function (texture) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(terrainWidth - 1, terrainDepth - 1)
    groundMaterial.map = texture
    groundMaterial.needsUpdate = true
  })
}

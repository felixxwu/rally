import { constant, heightData, scene } from '../../constant'
import { generateHeight } from './generateHeight'
import { THREE } from '../utils/THREE'
import { Mesh } from '../../types'

export const terrainWidthExtents = 800
export const terrainDepthExtents = 800
export const terrainWidth = 100
export const terrainDepth = 100
export const terrainHalfWidth = terrainWidth / 2
export const terrainHalfDepth = terrainDepth / 2
export const terrainMaxHeight = 0
export const terrainMinHeight = 0
export const terrainMesh = constant<Mesh | null>(null)

export function initTerrain() {
  heightData.current = generateHeight()

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

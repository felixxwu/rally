import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import {
  ammoHeightData,
  terrainWidth,
  terrainDepth,
  heightData,
  terrainMinHeight,
  terrainMaxHeight,
  terrainWidthExtents,
  terrainDepthExtents,
} from '../constant'

export function createTerrainShape() {
  // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
  const heightScale = 1

  // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
  const upAxis = 1

  // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
  const hdt = 'PHY_FLOAT'

  // Set this to your needs (inverts the triangles)
  const flipQuadEdges = false

  // Creates height data buffer in Ammo heap
  ammoHeightData.current = Ammo._malloc(4 * terrainWidth * terrainDepth)

  // Copy the javascript height data array to the Ammo one.
  let p = 0
  let p2 = 0

  for (let j = 0; j < terrainDepth; j++) {
    for (let i = 0; i < terrainWidth; i++) {
      // write 32-bit float data to memory

      Ammo.HEAPF32[((ammoHeightData.current ?? 0) + p2) >> 2] = heightData.current?.[p] ?? 0

      p++

      // 4 bytes/float
      p2 += 4
    }
  }

  // Creates the heightfield physics shape
  const heightFieldShape = new Ammo.btHeightfieldTerrainShape(
    terrainWidth,
    terrainDepth,
    ammoHeightData.current,
    heightScale,
    terrainMinHeight,
    terrainMaxHeight,
    upAxis,
    hdt,
    flipQuadEdges
  )

  // Set horizontal scale
  const scaleX = terrainWidthExtents / (terrainWidth - 1)
  const scaleZ = terrainDepthExtents / (terrainDepth - 1)
  heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ))

  heightFieldShape.setMargin(0.05)

  return heightFieldShape
}

import { terrainWidth, terrainDepth, terrainMaxHeight, terrainMinHeight } from './initTerrain'

export function generateHeight() {
  // Generates the height data (a sinus wave)
  const size = terrainWidth * terrainDepth
  const data = new Float32Array(size)

  const hRange = terrainMaxHeight - terrainMinHeight
  const w2 = terrainWidth / 2
  const d2 = terrainDepth / 2
  const phaseMult = 30

  let p = 0

  for (let j = 0; j < terrainDepth; j++) {
    for (let i = 0; i < terrainWidth; i++) {
      const radius = Math.sqrt(Math.pow((i - w2) / w2, 2.0) + Math.pow((j - d2) / d2, 2.0))

      const height =
        (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange * (1 / (radius + 1)) + terrainMinHeight

      data[p] = height

      p++
    }
  }

  return data
}

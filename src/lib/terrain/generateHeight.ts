import { mapHeightSegments, mapWidthSegments, mapWidth, mapHeight } from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';
import { getSeededHeight } from './getSeededHeight';
import { getSlope } from './getSlope';

export function generateHeight() {
  const size = mapWidthSegments * mapHeightSegments;
  const data = new Float32Array(size);
  let p = 0;

  for (let j = 0; j < mapHeightSegments; j++) {
    for (let i = 0; i < mapWidthSegments; i++) {
      data[p] = getHeightAt((i * mapWidth) / mapWidthSegments, (j * mapHeight) / mapHeightSegments);
      p++;
    }
  }

  return data;
}

export function getHeightAt(xPos: number, zPos: number) {
  const noise = createNoiseFunc();
  const hRange = getSeededHeight();
  const { slopeX, slopeZ } = getSlope();

  const x = (xPos / mapWidth) * mapWidthSegments;
  const z = (zPos / mapHeight) * mapHeightSegments;

  return Math.pow(noise(x, z), 2) * hRange + x * slopeX + z * slopeZ + 100;
}

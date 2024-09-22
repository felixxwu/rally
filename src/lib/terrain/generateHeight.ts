import { createNoise2D } from 'simplex-noise';
import { scale, terrainMinHeight } from '../../refs';
import { terrainMaxHeight } from '../../refs';
import { terrainDepth } from '../../refs';
import { terrainWidth } from '../../refs';

let seed = 3;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const simplex = createNoise2D(random);

const noise = (level, x, z) =>
  simplex(scale + level * x * scale, scale + level * z * scale) / level +
  (level > 1 ? noise(level / 2, x, z) : 0) +
  0.1;

export function generateHeight() {
  // Generates the height data (a sinus wave)
  const size = terrainWidth * terrainDepth;
  const data = new Float32Array(size);

  const hRange = terrainMaxHeight - terrainMinHeight;

  let p = 0;

  for (let j = 0; j < terrainDepth; j++) {
    for (let i = 0; i < terrainWidth; i++) {
      const height = Math.pow(noise(8, i, j), 1) * hRange + terrainMinHeight;

      data[p] = height;

      p++;
    }
  }

  return data;
}

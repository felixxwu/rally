import { localTerrainMesh, onRender, scene } from '../../refs';
import { createLocalTerrainMesh } from './createLocalTerrainMesh';
import { getCarPos } from '../car/getCarTransform';

let i = 0;

export function initLocalTerrain() {
  onRender.current.push([
    'terrain',
    () => {
      if (i++ % 30 !== 0) return;
      const pos = getCarPos();
      if (localTerrainMesh.current) scene.current?.remove(localTerrainMesh.current);
      localTerrainMesh.current = createLocalTerrainMesh(pos);
      if (localTerrainMesh.current) scene.current?.add(localTerrainMesh.current);
    },
  ]);
}

import { localTerrainMesh, scene } from '../../refs';
import { createLocalTerrainMesh } from './createLocalTerrainMesh';
import { getCarPos } from '../car/getCarTransform';
import { addOnRenderListener } from '../render/addOnRenderListener';

let i = 0;

export function initLocalTerrain() {
  addOnRenderListener('terrain', () => {
    if (i++ % 30 !== 0) return;
    const pos = getCarPos();
    if (localTerrainMesh.current) scene.current?.remove(localTerrainMesh.current);
    localTerrainMesh.current = createLocalTerrainMesh(pos);
    if (localTerrainMesh.current) scene.current?.add(localTerrainMesh.current);
  });
}

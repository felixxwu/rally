import { roadChunks, roadRenderDistance } from '../../refs';
import { getCarMeshPos } from '../car/getCarTransform';
import { getSpawn } from '../utils/getSpawn';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { THREE } from '../utils/THREE';

let frameCount = 0;
const VISIBILITY_UPDATE_INTERVAL_FRAMES = 10;

function updateRoadChunkVisibility(skipFrameCheck = false) {
  if (
    !skipFrameCheck &&
    (frameCount++ % VISIBILITY_UPDATE_INTERVAL_FRAMES !== 0 || roadChunks.current.length === 0)
  ) {
    return;
  }

  if (roadChunks.current.length === 0) return;

  const carPos = skipFrameCheck ? getSpawn() : getCarMeshPos();
  const renderDistanceSquared = roadRenderDistance.current ** 2;

  roadChunks.current.forEach(chunk => {
    const chunkPos = new THREE.Vector3(chunk.centerX, 0, chunk.centerZ);
    const visible = carPos.distanceToSquared(chunkPos) <= renderDistanceSquared;
    chunk.road.visible = visible;
    chunk.grassLeft.visible = visible;
    chunk.grassRight.visible = visible;
  });
}

export function initRoadChunkVisibility() {
  addOnRenderListener('updateRoadChunkVisibility', () => updateRoadChunkVisibility(false));
  updateRoadChunkVisibility(true);
}

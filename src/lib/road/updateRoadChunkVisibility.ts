import { roadChunks, roadRenderDistance, camera } from '../../refs';
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
  const cam = camera.current;
  const camPos = cam?.position;
  const camDir = new THREE.Vector3();
  if (cam) cam.getWorldDirection(camDir);

  roadChunks.current.forEach(chunk => {
    const chunkPos = new THREE.Vector3(chunk.centerX, 0, chunk.centerZ);
    const withinDistance = carPos.distanceToSquared(chunkPos) <= renderDistanceSquared;

    let isInFront = true;
    if (cam && camPos) {
      const toChunk = new THREE.Vector3().subVectors(chunkPos, camPos).normalize();
      const dot = camDir.dot(toChunk);
      isInFront = dot > 0;
    }

    const visible = withinDistance && isInFront;
    chunk.mesh.visible = visible;
  });
}

export function initRoadChunkVisibility() {
  addOnRenderListener('updateRoadChunkVisibility', () => updateRoadChunkVisibility(false));
  updateRoadChunkVisibility(true);
}

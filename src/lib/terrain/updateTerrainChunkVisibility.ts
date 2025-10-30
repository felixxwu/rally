import { terrainChunks, terrainRenderDistance } from '../../refs';
import { getCarMeshPos } from '../car/getCarTransform';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { THREE } from '../utils/THREE';

let frameCount = 0;
const VISIBILITY_UPDATE_INTERVAL_FRAMES = 10; // Update visibility every 10 frames for performance

/**
 * Updates terrain chunk visibility based on distance from car
 * Chunks within terrainRenderDistance are visible, others are hidden
 */
function updateTerrainChunkVisibility(skipFrameCheck = false) {
  if (
    !skipFrameCheck &&
    (frameCount++ % VISIBILITY_UPDATE_INTERVAL_FRAMES !== 0 || terrainChunks.current.length === 0)
  ) {
    return;
  }

  if (terrainChunks.current.length === 0) {
    return;
  }

  const carPos = getCarMeshPos();
  const renderDistanceSquared = terrainRenderDistance.current ** 2;

  terrainChunks.current.forEach(chunk => {
    const chunkPos = new THREE.Vector3(chunk.centerX, 0, chunk.centerZ);
    const distanceSquared = carPos.distanceToSquared(chunkPos);
    chunk.mesh.visible = distanceSquared <= renderDistanceSquared;
  });
}

/**
 * Initializes terrain chunk visibility management
 * Should be called after terrain chunks are created
 */
export function initTerrainChunkVisibility() {
  addOnRenderListener('updateTerrainChunkVisibility', () => updateTerrainChunkVisibility(false));
  // Set initial visibility immediately (bypass frame check)
  updateTerrainChunkVisibility(true);
}

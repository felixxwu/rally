import { heightData, physicsWorld, scene, terrainMesh, terrainChunks } from '../../refs';
import { generateHeight } from './generateHeight';
import { createTerrainRigidBody } from './createTerrainRigidBody';
import { createTerrainChunks } from './createTerrainChunks';
import { initTerrainChunkVisibility } from './updateTerrainChunkVisibility';
import { setUserData } from '../utils/userData';
import { THREE } from '../utils/THREE';

export function initTerrain() {
  heightData.current = generateHeight();
  const rigidBody = createTerrainRigidBody(heightData.current);

  // Create terrain chunks instead of a single mesh
  const chunks = createTerrainChunks(heightData.current);
  terrainChunks.current = chunks;

  // Create a group to contain all chunks for backwards compatibility
  // This allows existing code to toggle visibility via terrainMesh.current.visible
  const chunkGroup = new THREE.Group();
  chunks.forEach(chunk => {
    chunkGroup.add(chunk.mesh);
  });

  // Attach physics body reference to the group for backwards compatibility
  // The physics body represents the entire terrain, not individual chunks
  setUserData(chunkGroup as any, { physicsBody: rigidBody });

  physicsWorld.current?.addRigidBody(rigidBody);
  scene.current?.add(chunkGroup);

  // Store the group as terrainMesh for backwards compatibility
  terrainMesh.current = chunkGroup as any;

  // Initialize visibility management for chunks
  initTerrainChunkVisibility();
}

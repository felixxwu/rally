import { roadChunks, scene, temporaryMesh } from '../../refs';
import { createRoadTriangles } from './createRoadTriangles';
import { createRoadPoints } from './createRoadPoints';
import { resetIfFarFromRoad } from './resetIfFarFromRoad';
import { useUpdateLocalRoad } from './useUpdateLocalRoad';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { setInfoText } from '../UI/setInfoText';
import { initHouses } from './initHouses';
import { initTrees } from './initTrees';
import { initFinishLine } from './initFinishLine';
import { createRoadChunks } from './createRoadChunks';
import { initRoadChunkVisibility } from './updateRoadChunkVisibility';

export async function initRoad() {
  await createRoadPoints();

  setInfoText('Finishing up road');

  const { road, grassLeft, grassRight } = await createRoadTriangles();

  if (temporaryMesh.current) {
    scene.current?.remove(temporaryMesh.current.road);
  }

  // Build chunked visual road meshes and add to scene
  const chunks = createRoadChunks(road, grassLeft, grassRight);
  for (const chunk of chunks) {
    scene.current?.add(chunk.road);
    scene.current?.add(chunk.grassLeft);
    scene.current?.add(chunk.grassRight);
  }
  roadChunks.current = chunks;

  // setUserData(roadMesh.current, { physicsBody: roadRigidBody });
  // setUserData(grassLeftMesh.current, { physicsBody: grassLeftRigidBody });
  // setUserData(grassRightMesh.current, { physicsBody: grassRightRigidBody });
  //
  // physicsWorld.current?.addRigidBody(roadRigidBody);
  // physicsWorld.current?.addRigidBody(grassLeftRigidBody);
  // physicsWorld.current?.addRigidBody(grassRightRigidBody);

  setInfoText('');

  addOnRenderListener('resetIfFarFromRoad', resetIfFarFromRoad);

  const updateLocalRoad = useUpdateLocalRoad(road, grassLeft, grassRight);
  addOnRenderListener('localRoad', updateLocalRoad);

  // Initialize road chunk visibility control
  initRoadChunkVisibility();

  // Initialize houses along the road, then trees after houses are done
  await initHouses();
  await initTrees();

  // Initialize finish line at the end of the road
  initFinishLine();
}

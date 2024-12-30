import {
  grassColor,
  grassLeftMesh,
  grassRightMesh,
  roadColor,
  roadMesh,
  scene,
  temporaryMesh,
} from '../../refs';
import { createRoadShape } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createRoadPoints } from './createRoadPoints';
import { resetIfFarFromRoad } from './resetIfFarFromRoad';
import { useUpdateLocalRoad } from './useUpdateLocalRoad';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { setInfoText } from '../UI/setInfoText';

export async function initRoad() {
  await createRoadPoints();

  setInfoText('Finishing up road');

  const { road, grassLeft, grassRight } = await createRoadTriangles();

  if (temporaryMesh.current) {
    scene.current?.remove(temporaryMesh.current.road);
  }

  const { mesh: fullRoadMesh } = createRoadShape(road, roadColor, 0.7);
  const { mesh: fullGrassLeftMesh } = createRoadShape(grassLeft, grassColor, 1);
  const { mesh: fullGrassRightMesh } = createRoadShape(grassRight, grassColor, 1);

  scene.current?.add(fullRoadMesh);
  scene.current?.add(fullGrassLeftMesh);
  scene.current?.add(fullGrassRightMesh);

  roadMesh.current = fullRoadMesh;
  grassLeftMesh.current = fullGrassLeftMesh;
  grassRightMesh.current = fullGrassRightMesh;

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
}

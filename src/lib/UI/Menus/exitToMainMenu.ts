import {
  ammoHeightData,
  camera,
  carVisible,
  currentMenu,
  defaultTransitionTime,
  gear,
  grassLeftMesh,
  grassRightMesh,
  heightData,
  physicsWorld,
  progress,
  roadMesh,
  roadVecs,
  scene,
  stageTime,
  stageTimeStarted,
  stopOnRender,
  terrainMesh,
  transitionTime,
} from '../../../refs';
import { defaultCamPos } from '../../camera/initCamera';
import { platFormCarPos, setCarPos } from '../../car/setCarPos';
import { clearCaches } from '../../utils/clearCaches';
import { vec3 } from '../../utils/createVec';
import { getUserData } from '../../utils/userData';
import { sleep } from '../../utils/sleep';

export async function exitToMainMenu() {
  physicsWorld.current?.removeRigidBody(getUserData(terrainMesh.current!).physicsBody);
  // physicsWorld.current?.removeRigidBody(getUserData(roadMesh.current!).physicsBody);
  // physicsWorld.current?.removeRigidBody(getUserData(grassLeftMesh.current!).physicsBody);
  // physicsWorld.current?.removeRigidBody(getUserData(grassRightMesh.current!).physicsBody);

  scene.current?.remove(terrainMesh.current!);
  scene.current?.remove(roadMesh.current!);
  scene.current?.remove(grassLeftMesh.current!);
  scene.current?.remove(grassRightMesh.current!);

  terrainMesh.current?.remove();
  roadMesh.current?.remove();
  grassLeftMesh.current?.remove();
  grassRightMesh.current?.remove();

  terrainMesh.current = null;
  roadMesh.current = null;
  grassLeftMesh.current = null;
  grassRightMesh.current = null;

  transitionTime.current = defaultTransitionTime;
  currentMenu.current = 'main';
  carVisible.current = false;
  progress.current = 0;
  await sleep(defaultTransitionTime);
  stopOnRender.current = false;
  stageTimeStarted.current = false;
  stageTime.current = 0;
  roadVecs.current = [];
  heightData.current = null;
  ammoHeightData.current = null;

  setCarPos(platFormCarPos, vec3([0, 0, 1]));
  gear.current = 0;

  camera.current?.position.copy(defaultCamPos);

  clearCaches();
}

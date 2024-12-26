import {
  grassColor,
  grassLeftMesh,
  grassRightMesh,
  infoText,
  localGrassLeftMesh,
  localGrassRightMesh,
  localRoadMesh,
  onRender,
  physicsWorld,
  progress,
  roadColor,
  roadMesh,
  roadVecs,
  scene,
  temporaryMesh,
} from '../../refs';
import { createRoadShape, Triangle } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createRoadPoints } from './createRoadPoints';
import { resetIfFarFromRoad } from './resetIfFarFromRoad';
import { setUserData } from '../utils/userData';
import { vec3 } from '../utils/createVec';
import { getCarPos } from '../car/getCarTransform';
import { helperArrowFromTo } from '../helperArrows/helperArrow';

let i = 0;
const localRoadLength = 60;

export async function initRoad() {
  await createRoadPoints();

  infoText.current = 'Finishing up road';

  const { road, grassLeft, grassRight } = await createRoadTriangles();

  if (temporaryMesh.current) {
    scene.current?.remove(temporaryMesh.current.road);
  }

  const { rigidBody: roadRigidBody, mesh: fullRoadMesh } = createRoadShape(road, roadColor, 0.7);
  const { rigidBody: grassLeftRigidBody, mesh: fullGrassLeftMesh } = createRoadShape(
    grassLeft,
    grassColor,
    1
  );
  const { rigidBody: grassRightRigidBody, mesh: fullGrassRightMesh } = createRoadShape(
    grassRight,
    grassColor,
    1
  );

  scene.current?.add(fullRoadMesh);
  scene.current?.add(fullGrassLeftMesh);
  scene.current?.add(fullGrassRightMesh);

  roadMesh.current = fullRoadMesh;
  grassLeftMesh.current = fullGrassLeftMesh;
  grassRightMesh.current = fullGrassRightMesh;

  setUserData(roadMesh.current, { physicsBody: roadRigidBody });
  setUserData(grassLeftMesh.current, { physicsBody: grassLeftRigidBody });
  setUserData(grassRightMesh.current, { physicsBody: grassRightRigidBody });

  physicsWorld.current?.addRigidBody(roadRigidBody);
  physicsWorld.current?.addRigidBody(grassLeftRigidBody);
  physicsWorld.current?.addRigidBody(grassRightRigidBody);

  infoText.current = '';

  onRender.current.push(['resetIfFarFromRoad', resetIfFarFromRoad]);
  onRender.current.push([
    'localRoad',
    () => {
      if (i++ % 50 !== 0) return;
      const pos = getCarPos();
      let roadVecPos = roadVecs.current[0];
      let roadVecDistance = Infinity;
      let carProgressPos = progress.current;
      for (let i = progress.current; i > 0; i--) {
        const roadVec = roadVecs.current[i];
        const distance = vec3(roadVec).distanceTo(pos);
        if (distance < roadVecDistance) {
          roadVecPos = roadVec;
          roadVecDistance = distance;
          carProgressPos = i;
        }
      }
      helperArrowFromTo(pos, vec3(roadVecPos), 0x00ff00, 'localRoadCarPos');
      const localRoadFilter = (t: Triangle) => {
        if (carProgressPos < localRoadLength) return t.progress < localRoadLength * 2;
        return (
          t.progress > carProgressPos - localRoadLength / 2 &&
          t.progress < carProgressPos + localRoadLength / 2
        );
      };
      const localRoadTriangles = road.filter(localRoadFilter);
      const localGrassLeftTriangles = grassLeft.filter(localRoadFilter);
      const localGrassRightTriangles = grassRight.filter(localRoadFilter);

      const { mesh: roadTrianglesMesh } = createRoadShape(localRoadTriangles, '#fff', 1);
      const { mesh: grassLeftsMesh } = createRoadShape(localGrassLeftTriangles, '#fff', 1);
      const { mesh: grassRightMesh } = createRoadShape(localGrassRightTriangles, '#fff', 1);

      if (localRoadMesh.current) scene.current?.remove(localRoadMesh.current);
      if (localGrassLeftMesh.current) scene.current?.remove(localGrassLeftMesh.current);
      if (localGrassRightMesh.current) scene.current?.remove(localGrassRightMesh.current);

      scene.current?.add(roadTrianglesMesh);
      scene.current?.add(grassLeftsMesh);
      scene.current?.add(grassRightMesh);

      localRoadMesh.current = roadTrianglesMesh;
      localGrassLeftMesh.current = grassLeftsMesh;
      localGrassRightMesh.current = grassRightMesh;
    },
  ]);
}

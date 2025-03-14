import { createRoadShape, Triangle } from './createRoadShape';
import { getCarPos } from '../car/getCarTransform';
import {
  localGrassLeftMesh,
  localGrassRightMesh,
  localRoadMesh,
  progress,
  roadVecs,
  scene,
} from '../../refs';
import { vec3 } from '../utils/createVec';
import { helperArrowFromTo } from '../helperArrows/helperArrow';

let i = 0;
const localRoadLength = 25;

export function useUpdateLocalRoad(
  road: Triangle[],
  grassLeft: Triangle[],
  grassRight: Triangle[]
) {
  return () => {
    if (i++ % 20 !== 0) return;
    if (roadVecs.current.length === 0) return;

    const pos = getCarPos();
    let roadVecPos = roadVecs.current[0];
    let roadVecDistance = Infinity;
    let carProgressPos = progress.current;
    for (let i = progress.current + 500; i > 0; i--) {
      const roadVec = roadVecs.current[i];
      if (!roadVec) continue;
      const distance = vec3(roadVec).distanceTo(pos);
      if (distance < roadVecDistance) {
        roadVecPos = roadVec;
        roadVecDistance = distance;
        carProgressPos = i;
      }
    }
    helperArrowFromTo(pos, vec3(roadVecPos), 0xff00ff, 'localRoadCarPos');
    const localRoadFilter = (t: Triangle) => {
      if (carProgressPos < localRoadLength) return t.progress < localRoadLength * 2;
      return (
        t.progress > carProgressPos - localRoadLength * 0.4 &&
        t.progress < carProgressPos + localRoadLength * 0.6
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

    const localRoadStart = vec3(
      roadVecs.current.find((v, i) => i === localRoadTriangles[0].progress)
    );
    const localRoadEnd = vec3(
      roadVecs.current.find(
        (v, i) => i === localRoadTriangles[localRoadTriangles.length - 1].progress
      )
    );
    helperArrowFromTo(
      localRoadStart,
      localRoadStart.clone().add(vec3([0, 5, 0])),
      0xff00ff,
      'localRoadStart'
    );
    helperArrowFromTo(
      localRoadEnd,
      localRoadEnd.clone().add(vec3([0, 5, 0])),
      0xff00ff,
      'localRoadEnd'
    );
  };
}

import {
  car,
  currentMenu,
  maxSkidMarks,
  scene,
  selectedCar,
  skidMarkIntensity,
  skidMarkOpacities,
  stageTimeStarted,
  surfaceGrips,
} from '../../refs';
import { Surface } from '../../types';
import { getDragForce } from '../car/getDragForce';
import { getFromThreeV3Cache } from '../road/createRoadShape';
import { vec3 } from '../utils/createVec';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';

const skidMarks = ref<
  {
    mesh: THREE.Mesh | null;
    point: THREE.Vector3;
    pointLeft: THREE.Vector3;
    pointRight: THREE.Vector3;
  }[][]
>([[], [], [], []]);

export function addSkidMark(
  compression: number,
  wheelMeshPos: THREE.Vector3,
  totalTireForce: THREE.Vector3,
  sideTireForce: THREE.Vector3,
  straightTireForce: THREE.Vector3,
  front: boolean,
  left: boolean,
  surface: Surface
) {
  const wheelSkidMarks = skidMarks.current[front ? (left ? 0 : 1) : left ? 2 : 3];
  if (!car.current) return;
  if (!stageTimeStarted.current && currentMenu.current !== 'stageEnd') return;

  const prevPoint = wheelSkidMarks[wheelSkidMarks.length - 1]?.point || wheelMeshPos;
  const prevLeft = wheelSkidMarks[wheelSkidMarks.length - 1]?.pointLeft || wheelMeshPos;
  const prevRight = wheelSkidMarks[wheelSkidMarks.length - 1]?.pointRight || wheelMeshPos;

  const diff = prevPoint.clone().sub(wheelMeshPos);
  const rightQuat = new THREE.Quaternion();
  rightQuat.setFromAxisAngle(vec3([0, 1, 0]), Math.PI / -2);
  const right = diff
    .clone()
    .projectOnPlane(vec3([0, 1, 0]))
    .applyQuaternion(rightQuat)
    .setLength(selectedCar.current.wheelWidth);
  const wheelLeft = wheelMeshPos.clone().add(right.clone().divideScalar(-2));
  const wheelRight = wheelMeshPos.clone().add(right.clone().divideScalar(2));

  const mesh = skidMarkSegment(
    wheelLeft,
    wheelRight,
    prevLeft,
    prevRight,
    compression,
    totalTireForce,
    sideTireForce,
    straightTireForce,
    surface,
    front,
    left
  );
  mesh && scene.current?.add(mesh);
  wheelSkidMarks.push({ mesh, point: wheelMeshPos, pointLeft: wheelLeft, pointRight: wheelRight });

  if (wheelSkidMarks.filter(m => m.mesh).length > maxSkidMarks) {
    const shiftedMesh = wheelSkidMarks.shift()!.mesh;
    shiftedMesh && scene.current?.remove(shiftedMesh);
  }
}

function skidMarkSegment(
  wheelLeft: THREE.Vector3,
  wheelRight: THREE.Vector3,
  prevLeft: THREE.Vector3,
  prevRight: THREE.Vector3,
  compression: number,
  totalTireForce: THREE.Vector3,
  sideTireForce: THREE.Vector3,
  straightTireForce: THREE.Vector3,
  surface: Surface,
  front: boolean,
  left: boolean
) {
  const drag = getDragForce().length();
  const beforeClamp = sideTireForce.length() / 4 + straightTireForce.length();
  const afterClamp = totalTireForce.length();

  const opacity = Math.min(
    (beforeClamp - afterClamp - drag) * skidMarkIntensity * compression,
    surfaceGrips[surface].opacity
  );

  skidMarkOpacities.current[front ? (left ? 0 : 1) : left ? 2 : 3] = opacity;

  if (opacity <= 0.01) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: surfaceGrips[surface].colour,
    transparent: true,
    forceSinglePass: true,
  });
  groundMaterial.opacity = opacity;

  geometry.setFromPoints([
    getFromThreeV3Cache(prevLeft),
    getFromThreeV3Cache(wheelLeft),
    getFromThreeV3Cache(wheelRight),
    getFromThreeV3Cache(prevLeft),
    getFromThreeV3Cache(wheelRight),
    getFromThreeV3Cache(prevRight),
  ]);

  return new THREE.Mesh(geometry, groundMaterial);
}

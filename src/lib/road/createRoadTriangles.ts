import {
  bankingAngle,
  grassWidth,
  halfRoadWidth,
  maxBankingLength,
  roadVecs,
  startRoadLength,
  startRoadWidth,
} from '../../refs';
import { createNoiseFunc } from '../terrain/createNoiseFunc';
import { createArr, vec3 } from '../utils/createVec';
import { THREE } from '../utils/THREE';
import { Triangle, Vector } from './createRoadShape';
import { setInfoText } from '../UI/setInfoText';
import { sleep } from '../utils/sleep';

export async function createRoadTriangles(skipGrass?: boolean) {
  const vecs = roadVecs.current;
  if (vecs.length < 10) {
    return { road: [], grassLeft: [], grassRight: [] };
  }

  const road: Triangle[] = [];
  const grassLeft: Triangle[] = [];
  const grassRight: Triangle[] = [];

  for (let i = 0; i < vecs.length; i++) {
    const leftHandedTriangle = i % 2 === 0;

    if (i < 2 || i >= vecs.length - 2) continue;

    const { left, right, leftGrass, rightGrass } = getSideVecs(vecs, i, skipGrass);
    const {
      left: prevLeft,
      right: prevRight,
      leftGrass: prevLeftGrass,
      rightGrass: prevRightGrass,
    } = getSideVecs(vecs, i - 1, skipGrass);
    const {
      left: nextLeft,
      right: nextRight,
      leftGrass: nextLeftGrass,
      rightGrass: nextRightGrass,
    } = getSideVecs(vecs, i + 1, skipGrass);

    if (leftHandedTriangle) {
      road.push({
        0: createArr(left),
        1: createArr(prevRight),
        2: createArr(nextRight),
        progress: i,
      });
    } else {
      road.push({
        0: createArr(prevLeft),
        1: createArr(right),
        2: createArr(nextLeft),
        progress: i,
      });
    }

    if (!skipGrass) {
      if (i % 100 === 0) {
        setInfoText(`Creating Road Mesh... ${Math.round((i / vecs.length) * 100)}%`);
        await sleep();
      }

      const leftBanking = getBankingPoint(vecs, i, leftGrass, -bankingAngle);
      const prevLeftBanking = getBankingPoint(vecs, i - 1, prevLeftGrass, -bankingAngle);
      const nextLeftBanking = getBankingPoint(vecs, i + 1, nextLeftGrass, -bankingAngle);
      const rightBanking = getBankingPoint(vecs, i, rightGrass, bankingAngle);
      const prevRightBanking = getBankingPoint(vecs, i - 1, prevRightGrass, bankingAngle);
      const nextRightBanking = getBankingPoint(vecs, i + 1, nextRightGrass, bankingAngle);

      if (leftHandedTriangle) {
        grassLeft.push({
          0: createArr(nextLeftGrass),
          1: createArr(prevLeftGrass),
          2: createArr(left),
          progress: i,
        });
        leftBanking &&
          grassLeft.push({
            0: createArr(leftBanking),
            1: createArr(prevLeftGrass),
            2: createArr(nextLeftGrass),
            progress: i,
          });
        grassRight.push({
          0: createArr(prevRight),
          1: createArr(rightGrass),
          2: createArr(nextRight),
          progress: i,
        });
        prevRightBanking &&
          nextRightBanking &&
          grassRight.push({
            0: createArr(prevRightBanking),
            1: createArr(nextRightBanking),
            2: createArr(rightGrass),
            progress: i,
          });
      } else {
        grassLeft.push({
          0: createArr(prevLeft),
          1: createArr(nextLeft),
          2: createArr(leftGrass),
          progress: i,
        });
        nextLeftBanking &&
          prevLeftBanking &&
          grassLeft.push({
            0: createArr(nextLeftBanking),
            1: createArr(prevLeftBanking),
            2: createArr(leftGrass),
            progress: i,
          });
        grassRight.push({
          0: createArr(right),
          1: createArr(prevRightGrass),
          2: createArr(nextRightGrass),
          progress: i,
        });
        rightBanking &&
          grassRight.push({
            0: createArr(nextRightGrass),
            1: createArr(prevRightGrass),
            2: createArr(rightBanking),
            progress: i,
          });
      }
    }
  }

  return { road, grassLeft, grassRight };
}

function getSideVecs(vecs: Vector[], i: number, skipGrass?: boolean) {
  const vec = vec3(vecs[i]);
  const prev = vec3(vecs[i - 1]);
  const next = vec3(vecs[i + 1]);
  const diff = next.clone().sub(prev);

  const leftQuat = new THREE.Quaternion();
  leftQuat.setFromAxisAngle(vec3([0, 1, 0]), Math.PI / 2);
  const rightQuat = new THREE.Quaternion();
  rightQuat.setFromAxisAngle(vec3([0, 1, 0]), Math.PI / -2);

  const roadWidth =
    i < startRoadLength || i >= vecs.length - startRoadLength ? startRoadWidth : halfRoadWidth;

  const projectedLeft = diff
    .clone()
    .projectOnPlane(vec3([0, 1, 0]))
    .applyQuaternion(leftQuat)
    .setLength(roadWidth);
  const projectedRight = diff
    .clone()
    .projectOnPlane(vec3([0, 1, 0]))
    .applyQuaternion(rightQuat)
    .setLength(roadWidth);

  const left = vec.clone().add(projectedLeft);
  const right = vec.clone().add(projectedRight);

  if (skipGrass) {
    return {
      left,
      right,
      leftGrass: left,
      rightGrass: right,
    };
  }

  const noise = createNoiseFunc();
  const noiseScale = 0.1;
  const leftGrass = vec.clone().add(projectedLeft.clone().setLength(grassWidth + roadWidth));
  const rightGrass = vec.clone().add(projectedRight.clone().setLength(grassWidth + roadWidth));
  const leftNoise = noise(leftGrass.x * noiseScale + 1, leftGrass.z * noiseScale + 1) * 2 - 1;
  const rightNoise = noise(rightGrass.x * noiseScale + 1, rightGrass.z * noiseScale + 1) * 2 - 1;
  const leftGrassNoise = noise(leftGrass.x * noiseScale, leftGrass.z * noiseScale) * 2 - 1;
  const rightGrassNoise = noise(rightGrass.x * noiseScale, rightGrass.z * noiseScale) * 2 - 1;
  const leftRoad = vec.clone().add(projectedLeft.multiplyScalar(1 - leftNoise / 3));
  const rightRoad = vec.clone().add(projectedRight.multiplyScalar(1 - rightNoise / 3));
  leftGrass.add(new THREE.Vector3(0, leftGrassNoise * 0.8 - 0.6, 0));
  rightGrass.add(new THREE.Vector3(0, rightGrassNoise * 0.8 - 0.6, 0));

  return {
    left: leftRoad,
    leftGrass,
    right: rightRoad,
    rightGrass,
  };
}

function getBankingPoint(vecs: Vector[], i: number, grassSide: THREE.Vector3, angle: number) {
  if (Math.abs(angle) > Math.PI / 2) return null;

  const vec = vec3(vecs[i]);
  const sideDir = grassSide.clone().sub(vec).normalize();
  const prev = vec3(vecs[i - 1]);
  const next = vec3(vecs[i + 1]);
  const diff = next.clone().sub(prev);
  const quat = new THREE.Quaternion();
  quat.setFromAxisAngle(diff.clone().normalize(), angle);

  const rotated = sideDir.clone().applyQuaternion(quat);

  return grassSide.clone().add(rotated.setLength(maxBankingLength));
}

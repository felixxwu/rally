import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  grassLeftMesh,
  grassRightMesh,
  grassWidth,
  halfRoadWidth,
  houseRenderDistance,
  localGrassLeftMesh,
  localGrassRightMesh,
  localTerrainMesh,
  onRender,
  physicsWorld,
  roadVecs,
  scene,
  seed,
  startRoadLength,
  startRoadWidth,
  terrainMesh,
} from '../../refs';
import { getCarMeshPos } from '../car/getCarTransform';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { getUserData, setUserData } from '../utils/userData';
import { THREE } from '../utils/THREE';
import { getAmmoVector } from '../utils/vectorConversion';
import { vec3 } from '../utils/createVec';
import { Vector } from './createRoadShape';
import { setInfoText } from '../UI/setInfoText';

// Constants
const HOUSE_SPACING = 1;
const HOUSE_OFFSET_RANGE = { min: 2, max: 20 }; // Distance from road edge
const HOUSE_SPAWN_CHANCE = 0.1;
const HOUSE_SIZE_BASE = { width: 12, depth: 12, height: 7 };
const HOUSE_SINK_AMOUNT = 2;
const ROOF_HEIGHT_RATIO = 0.6;
const DIMENSION_VARIATION = { min: 0.8, max: 1.2 };
const ROTATION_VARIATION = { min: -0.2, max: 0.2 };
const SCALE_VARIATION = { min: 0.9, max: 1.1 };
const COLOR_VARIATION = 30;
const BROWN_BASE = { r: 0x8b, g: 0x73, b: 0x55 };
const ROOF_COLOR = 0x6b4e3f;

// Seeded random number generator
class SeededRandom {
  public seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  randomRange(min: number, max: number): number {
    return min + this.random() * (max - min);
  }
}

// State
const houses: THREE.Mesh[] = [];
const houseRoofs: THREE.Mesh[] = [];
let updateVisibilityCallback: ((deltaTime: number) => void) | null = null;
let createHouseCallback: ((deltaTime: number) => void) | null = null;
const houseCreationQueue: HouseCandidate[] = [];

interface HouseCandidate {
  basePos: THREE.Vector3;
  roadDirection: THREE.Vector3;
  side: 'left' | 'right';
  offsetFromRoad: number; // Random distance from road
  rng: SeededRandom;
}

// Helper: Create and configure mesh
function createMesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = false; // Start invisible, visibility managed by distance checks
  return mesh;
}

// Helper: Dispose material
function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(material)) {
    material.forEach(m => m.dispose());
  } else {
    material.dispose();
  }
}

// Helper: Generate random brown color
function generateRandomBrown(rng: SeededRandom): number {
  const r = Math.max(
    0,
    Math.min(255, BROWN_BASE.r + rng.randomRange(-COLOR_VARIATION, COLOR_VARIATION))
  );
  const g = Math.max(
    0,
    Math.min(255, BROWN_BASE.g + rng.randomRange(-COLOR_VARIATION, COLOR_VARIATION))
  );
  const b = Math.max(
    0,
    Math.min(255, BROWN_BASE.b + rng.randomRange(-COLOR_VARIATION, COLOR_VARIATION))
  );
  return (r << 16) | (g << 8) | b;
}

// Helper: Create roof geometry
function createRoofGeometry(width: number, depth: number, height: number): THREE.BufferGeometry {
  const roofHeight = height * ROOF_HEIGHT_RATIO;
  const hw = width / 2;
  const hd = depth / 2;

  const vertices = new Float32Array([
    -hw,
    0,
    -hd,
    hw,
    0,
    -hd,
    hw,
    0,
    hd,
    -hw,
    0,
    hd, // Base rectangle
    0,
    roofHeight,
    -hd,
    0,
    roofHeight,
    hd, // Peak points
  ]);

  const indices = new Uint16Array([
    0,
    1,
    4, // Front
    3,
    2,
    5, // Back
    0,
    4,
    5,
    0,
    5,
    3, // Left side
    1,
    2,
    5,
    1,
    5,
    4, // Right side
    0,
    3,
    2,
    0,
    2,
    1, // Bottom
  ]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

// Helper: Get side position for house
function getSidePosition(
  vecs: Vector[],
  i: number,
  side: 'left' | 'right',
  offsetFromRoad: number
): THREE.Vector3 {
  const vec = vec3(vecs[i]);
  const prev = vec3(vecs[i - 1] || vecs[i]);
  const next = vec3(vecs[i + 1] || vecs[i]);
  const diff = next.clone().sub(prev);

  const roadWidth =
    i < startRoadLength || i >= vecs.length - startRoadLength ? startRoadWidth : halfRoadWidth;
  const angle = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
  const quat = new THREE.Quaternion().setFromAxisAngle(vec3([0, 1, 0]), angle);

  const projected = diff
    .clone()
    .projectOnPlane(vec3([0, 1, 0]))
    .applyQuaternion(quat)
    .setLength(roadWidth + grassWidth + offsetFromRoad);

  return vec.clone().add(projected);
}

// Helper: Get height on grass mesh
function getHeightOnGrassMesh(x: number, z: number): number | null {
  const raycaster = new THREE.Raycaster(new THREE.Vector3(x, 1000, z), new THREE.Vector3(0, -1, 0));
  const meshes = [
    localGrassLeftMesh.current,
    localGrassRightMesh.current,
    grassLeftMesh.current,
    grassRightMesh.current,
    localTerrainMesh.current,
    terrainMesh.current,
  ].filter(Boolean) as THREE.Object3D[];

  let hitDistance = Infinity;
  for (const mesh of meshes) {
    const intersections = raycaster.intersectObject(mesh, false);
    if (intersections[0]?.distance < hitDistance) {
      hitDistance = intersections[0].distance;
    }
  }

  return hitDistance < Infinity ? 1000 - hitDistance : null;
}

// Helper: Create a single house
function createSingleHouse(candidate: HouseCandidate): boolean {
  const { basePos, roadDirection, side, rng } = candidate;

  const height = getHeightOnGrassMesh(basePos.x, basePos.z);
  if (height === null) return false;

  // Generate random dimensions
  const dimensions = {
    width:
      HOUSE_SIZE_BASE.width * rng.randomRange(DIMENSION_VARIATION.min, DIMENSION_VARIATION.max),
    depth:
      HOUSE_SIZE_BASE.depth * rng.randomRange(DIMENSION_VARIATION.min, DIMENSION_VARIATION.max),
    height:
      HOUSE_SIZE_BASE.height * rng.randomRange(DIMENSION_VARIATION.min, DIMENSION_VARIATION.max),
  };

  // Create house
  const houseGeometry = new THREE.BoxGeometry(
    dimensions.width,
    dimensions.height,
    dimensions.depth
  );
  const houseMaterial = new THREE.MeshStandardMaterial({
    color: generateRandomBrown(rng),
    roughness: 0.8,
    metalness: 0.1,
  });
  const house = createMesh(houseGeometry, houseMaterial);

  // Position and rotate house
  house.position.set(basePos.x, height + dimensions.height / 2 - HOUSE_SINK_AMOUNT, basePos.z);
  house.rotation.y =
    Math.atan2(roadDirection.x, roadDirection.z) +
    (side === 'left' ? Math.PI / 2 : -Math.PI / 2) +
    rng.randomRange(ROTATION_VARIATION.min, ROTATION_VARIATION.max);
  house.scale.setScalar(rng.randomRange(SCALE_VARIATION.min, SCALE_VARIATION.max));

  // Create roof
  const roofGeometry = createRoofGeometry(dimensions.width, dimensions.depth, dimensions.height);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: ROOF_COLOR,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const roof = createMesh(roofGeometry, roofMaterial);
  roof.position.set(0, dimensions.height / 2, 0);

  house.add(roof);

  // Create physics body for collision
  const halfExtents = new Ammo.btVector3(
    (dimensions.width * house.scale.x) / 2,
    ((dimensions.height + dimensions.height * ROOF_HEIGHT_RATIO) * house.scale.y) / 2,
    (dimensions.depth * house.scale.z) / 2
  );
  const shape = new Ammo.btBoxShape(halfExtents);

  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(getAmmoVector(house.position));

  // Convert rotation to Ammo quaternion
  const quat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    house.rotation.y
  );
  const ammoQuat = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
  transform.setRotation(ammoQuat);

  const mass = 0; // Static object
  const localInertia = new Ammo.btVector3(0, 0, 0);
  const motionState = new Ammo.btDefaultMotionState(transform);
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  const rigidBody = new Ammo.btRigidBody(rbInfo);

  setUserData(house as any, { physicsBody: rigidBody });
  physicsWorld.current?.addRigidBody(rigidBody);

  scene.current?.add(house);
  houses.push(house);
  houseRoofs.push(roof);
  return true;
}

// Helper: Remove render listener
function removeListener(callback: ((deltaTime: number) => void) | null): void {
  if (callback) {
    onRender.current = onRender.current.filter(f => f[1] !== callback);
  }
}

export function initHouses(): Promise<void> {
  cleanupHouses();

  return new Promise<void>(resolve => {
    const vecs = roadVecs.current;
    if (vecs.length < 10) {
      resolve();
      return;
    }

    const rng = new SeededRandom(seed.current);
    houseCreationQueue.length = 0;
    let houseIndex = 0;

    // Generate house candidates
    for (let i = startRoadLength + 50; i < vecs.length - startRoadLength - 50; i += HOUSE_SPACING) {
      if (rng.random() > HOUSE_SPAWN_CHANCE) continue;

      const side: 'left' | 'right' = rng.random() < 0.5 ? 'left' : 'right';
      const offsetFromRoad = rng.randomRange(HOUSE_OFFSET_RANGE.min, HOUSE_OFFSET_RANGE.max);
      const basePos = getSidePosition(vecs, i, side, offsetFromRoad);

      // Add random perpendicular offset
      const roadDir = vec3(vecs[i + 1] || vecs[i])
        .sub(vec3(vecs[i - 1] || vecs[i]))
        .normalize();
      const perpendicular = new THREE.Vector3(-roadDir.z, 0, roadDir.x);
      basePos.add(perpendicular.multiplyScalar(rng.randomRange(-3, 3)));

      houseCreationQueue.push({
        basePos: basePos.clone(),
        roadDirection: roadDir.clone(),
        side,
        offsetFromRoad,
        rng: new SeededRandom(seed.current * 1000 + houseIndex++),
      });
    }

    // Set up distance-based visibility updates (before Promise resolves)
    let frameCount = 0;
    updateVisibilityCallback = () => {
      if (frameCount++ % 10 !== 0 || houses.length === 0) return;

      const carPos = getCarMeshPos();
      const renderDistanceSquared = houseRenderDistance.current ** 2;

      for (let i = 0; i < houses.length; i++) {
        const house = houses[i];
        const roof = houseRoofs[i];
        const isVisible = carPos.distanceToSquared(house.position) <= renderDistanceSquared;

        house.visible = isVisible;
        if (roof) {
          roof.visible = isVisible;
        }
      }
    };
    addOnRenderListener('updateHouseVisibility', updateVisibilityCallback);

    // Set up incremental house creation with time-based chunking
    const totalHouses = houseCreationQueue.length;
    const TIME_BUDGET_MS = 15; // Max milliseconds to spend creating objects per frame
    let lastProgressUpdate = 0;
    createHouseCallback = () => {
      if (houseCreationQueue.length === 0) {
        setInfoText('');
        removeListener(createHouseCallback);
        createHouseCallback = null;
        // Trigger visibility check after all houses are created
        setTimeout(() => {
          if (updateVisibilityCallback && houses.length > 0) {
            updateVisibilityCallback(0);
          }
        }, 0);
        resolve();
        return;
      }

      const startTime = performance.now();
      let created = 0;

      // Create as many houses as possible within time budget
      while (houseCreationQueue.length > 0 && performance.now() - startTime < TIME_BUDGET_MS) {
        const candidate = houseCreationQueue.shift();
        if (candidate && createSingleHouse(candidate)) {
          created++;
        }
      }

      // Update progress text periodically (every 10% progress or significant number of houses)
      const remaining = houseCreationQueue.length;
      const completed = totalHouses - remaining;
      const progress = totalHouses > 0 ? Math.round((completed / totalHouses) * 100) : 0;

      if (completed - lastProgressUpdate >= Math.max(1, totalHouses / 100) || remaining === 0) {
        setInfoText(`Loading houses... ${progress}%`);
        lastProgressUpdate = completed;
      }
    };
    if (totalHouses > 0) {
      setInfoText('Loading houses... 0%');
      addOnRenderListener('createHouses', createHouseCallback);
    } else {
      // No houses to create, resolve immediately
      resolve();
    }
  });
}

export function cleanupHouses(): void {
  removeListener(updateVisibilityCallback);
  removeListener(createHouseCallback);
  updateVisibilityCallback = null;
  createHouseCallback = null;
  houseCreationQueue.length = 0;

  for (let i = 0; i < houses.length; i++) {
    const house = houses[i];
    const roof = houseRoofs[i];

    if (roof) {
      roof.geometry.dispose();
      disposeMaterial(roof.material);
    }

    // Remove physics body
    const userData = getUserData(house as any);
    if (userData?.physicsBody) {
      physicsWorld.current?.removeRigidBody(userData.physicsBody);
      Ammo.destroy(userData.physicsBody);
    }

    scene.current?.remove(house);
    house.geometry.dispose();
    disposeMaterial(house.material);
  }

  houses.length = 0;
  houseRoofs.length = 0;
}

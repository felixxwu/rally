import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  grassLeftMesh,
  grassRightMesh,
  grassWidth,
  halfRoadWidth,
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
  treeRenderDistance,
} from '../../refs';
import { getCarMeshPos } from '../car/getCarTransform';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { getUserData, setUserData } from '../utils/userData';
import { THREE } from '../utils/THREE';
import { getAmmoVector } from '../utils/vectorConversion';
import { vec3 } from '../utils/createVec';
import { Vector } from './createRoadShape';

// Constants
const TREE_SPACING = 1;
const TREE_OFFSET_RANGE = { min: 0, max: 50 }; // Distance from road edge
const TREE_SPAWN_CHANCE = 0.3;
const TREE_TRUNK_BASE = { radius: 0.6, height: 4 };
const TREE_FOLIAGE_BASE = { radius: 3 };
const TREE_SINK_AMOUNT = 0.5;
const DIMENSION_VARIATION = { min: 0.8, max: 1.2 };
const ROTATION_VARIATION = { min: -Math.PI, max: Math.PI };
const PERPENDICULAR_OFFSET_VARIATION = { min: -2, max: 2 };
const TRUNK_COLOR = 0x4a3728;
const FOLIAGE_COLOR = 0x2d5016;
const TREE_INITIAL_SPAWN_OFFSET = 50;
const VISIBILITY_UPDATE_INTERVAL_FRAMES = 10;

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
const trees: THREE.Mesh[] = [];
const treeFoliage: THREE.Mesh[] = [];
let updateVisibilityCallback: ((deltaTime: number) => void) | null = null;
let createTreeCallback: ((deltaTime: number) => void) | null = null;
const treeCreationQueue: TreeCandidate[] = [];

interface TreeCandidate {
  basePos: THREE.Vector3;
  roadDirection: THREE.Vector3;
  side: 'left' | 'right';
  offsetFromRoad: number;
  rng: SeededRandom;
}

// Helper: Create and configure mesh
function createMesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.visible = true;
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

// Helper: Remove render listener
function removeListener(callback: ((deltaTime: number) => void) | null): void {
  if (callback) {
    onRender.current = onRender.current.filter(f => f[1] !== callback);
  }
}

// Helper: Get side position for tree
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
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3(x, 1000, z);
  const direction = new THREE.Vector3(0, -1, 0);
  raycaster.set(origin, direction);

  const meshesToCheck = [
    localGrassLeftMesh.current,
    localGrassRightMesh.current,
    grassLeftMesh.current,
    grassRightMesh.current,
    localTerrainMesh.current,
    terrainMesh.current,
  ].filter(Boolean) as THREE.Mesh[];

  let hitDistance = Infinity;

  for (const mesh of meshesToCheck) {
    const intersections = raycaster.intersectObject(mesh, false);
    if (intersections.length > 0 && intersections[0].distance < hitDistance) {
      hitDistance = intersections[0].distance;
    }
  }

  return hitDistance < Infinity ? 1000 - hitDistance : null;
}

// Helper: Create a single tree
function createSingleTree(candidate: TreeCandidate): boolean {
  const { basePos, roadDirection, side, rng } = candidate;

  const height = getHeightOnGrassMesh(basePos.x, basePos.z);
  if (height === null) return false;

  // Generate random dimensions
  const trunkRadius =
    TREE_TRUNK_BASE.radius * rng.randomRange(DIMENSION_VARIATION.min, DIMENSION_VARIATION.max);
  const trunkHeight =
    TREE_TRUNK_BASE.height * rng.randomRange(DIMENSION_VARIATION.min, DIMENSION_VARIATION.max);
  const foliageRadius =
    TREE_FOLIAGE_BASE.radius * rng.randomRange(DIMENSION_VARIATION.min, DIMENSION_VARIATION.max);

  // Create trunk (cylinder)
  const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: TRUNK_COLOR,
    roughness: 0.9,
    metalness: 0,
  });
  const trunk = createMesh(trunkGeometry, trunkMaterial);

  // Position trunk
  trunk.position.set(basePos.x, height + trunkHeight / 2 - TREE_SINK_AMOUNT, basePos.z);
  trunk.rotation.y = rng.randomRange(ROTATION_VARIATION.min, ROTATION_VARIATION.max);

  // Create foliage (sphere)
  const foliageGeometry = new THREE.SphereGeometry(foliageRadius, 8, 8);
  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: FOLIAGE_COLOR,
    roughness: 0.9,
    metalness: 0,
  });
  const foliage = createMesh(foliageGeometry, foliageMaterial);
  foliage.position.set(0, trunkHeight / 2 + foliageRadius * 0.7, 0);

  trunk.add(foliage);

  // Create physics body for trunk collision
  const trunkHalfHeight = trunkHeight / 2;
  const shape = new Ammo.btCylinderShape(
    new Ammo.btVector3(trunkRadius, trunkHalfHeight, trunkRadius)
  );

  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(getAmmoVector(trunk.position));

  // Convert rotation to Ammo quaternion
  const quat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    trunk.rotation.y
  );
  const ammoQuat = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
  transform.setRotation(ammoQuat);

  const mass = 0; // Static object
  const localInertia = new Ammo.btVector3(0, 0, 0);
  const motionState = new Ammo.btDefaultMotionState(transform);
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  const rigidBody = new Ammo.btRigidBody(rbInfo);

  setUserData(trunk as any, { physicsBody: rigidBody });
  physicsWorld.current?.addRigidBody(rigidBody);

  scene.current?.add(trunk);
  trees.push(trunk);
  treeFoliage.push(foliage);
  return true;
}

export function initTrees(): void {
  cleanupTrees();

  const vecs = roadVecs.current;
  if (vecs.length < 10) return;

  const rng = new SeededRandom(seed.current);
  treeCreationQueue.length = 0;
  let treeIndex = 0;

  // Generate tree candidates
  for (
    let i = startRoadLength + TREE_INITIAL_SPAWN_OFFSET;
    i < vecs.length - startRoadLength - TREE_INITIAL_SPAWN_OFFSET;
    i += TREE_SPACING
  ) {
    if (rng.random() > TREE_SPAWN_CHANCE) continue;

    const side: 'left' | 'right' = rng.random() < 0.5 ? 'left' : 'right';
    const offsetFromRoad = rng.randomRange(TREE_OFFSET_RANGE.min, TREE_OFFSET_RANGE.max);
    const basePos = getSidePosition(vecs, i, side, offsetFromRoad);

    // Add random perpendicular offset
    const roadDir = vec3(vecs[i + 1] || vecs[i])
      .sub(vec3(vecs[i - 1] || vecs[i]))
      .normalize();
    const perpendicular = new THREE.Vector3(-roadDir.z, 0, roadDir.x);
    basePos.add(
      perpendicular.multiplyScalar(
        rng.randomRange(PERPENDICULAR_OFFSET_VARIATION.min, PERPENDICULAR_OFFSET_VARIATION.max)
      )
    );

    treeCreationQueue.push({
      basePos: basePos.clone(),
      roadDirection: roadDir.clone(),
      side,
      offsetFromRoad,
      rng: new SeededRandom(seed.current * 2000 + treeIndex++),
    });
  }

  // Set up incremental tree creation (1 per frame)
  createTreeCallback = () => {
    if (treeCreationQueue.length === 0) {
      removeListener(createTreeCallback);
      createTreeCallback = null;
      return;
    }

    const candidate = treeCreationQueue.shift();
    if (candidate) createSingleTree(candidate);
  };
  addOnRenderListener('createTrees', createTreeCallback);

  // Set up distance-based visibility updates
  let frameCount = 0;
  updateVisibilityCallback = () => {
    if (frameCount++ % VISIBILITY_UPDATE_INTERVAL_FRAMES !== 0 || trees.length === 0) return;

    const carPos = getCarMeshPos();
    const renderDistanceSquared = treeRenderDistance.current ** 2;

    for (const tree of trees) {
      tree.visible = carPos.distanceToSquared(tree.position) <= renderDistanceSquared;
    }
  };
  addOnRenderListener('updateTreeVisibility', updateVisibilityCallback);
}

export function cleanupTrees(): void {
  removeListener(updateVisibilityCallback);
  removeListener(createTreeCallback);
  updateVisibilityCallback = null;
  createTreeCallback = null;
  treeCreationQueue.length = 0;

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const foliage = treeFoliage[i];

    if (foliage) {
      foliage.geometry.dispose();
      disposeMaterial(foliage.material);
    }

    // Remove physics body
    const userData = getUserData(tree as any);
    if (userData?.physicsBody) {
      physicsWorld.current?.removeRigidBody(userData.physicsBody);
      Ammo.destroy(userData.physicsBody);
    }

    scene.current?.remove(tree);
    tree.geometry.dispose();
    disposeMaterial(tree.material);
  }

  trees.length = 0;
  treeFoliage.length = 0;
}

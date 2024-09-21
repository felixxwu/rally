import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import { Mesh } from './types';
import { THREE } from './lib/utils/THREE';
import { ref } from './lib/utils/ref';

// Heightfield parameters
export const terrainWidthExtents = 800;
export const terrainDepthExtents = 800;
export const terrainWidth = 70;
export const terrainDepth = 70;
export const terrainHalfWidth = terrainWidth / 2;
export const terrainHalfDepth = terrainDepth / 2;
export const terrainMaxHeight = 10;
export const terrainMinHeight = -2;
export const terrainMesh = ref<Mesh | null>(null);

export const onRender: ((deltaTime: number) => void)[] = [];

// Graphics variables
export const container = ref<HTMLElement | null>(null);
export let stats = ref<Stats | null>(null);
export let camera = ref<THREE.PerspectiveCamera | null>(null);
export let scene = ref<THREE.Scene | null>(null);
export let renderer = ref<THREE.WebGLRenderer | null>(null);
export const clock = new THREE.Clock();

// Physics variables
export let collisionConfiguration = ref<AmmoType.btDefaultCollisionConfiguration | null>(null);
export let dispatcher = ref<AmmoType.btCollisionDispatcher | null>(null);
export let broadphase = ref<AmmoType.btDbvtBroadphase | null>(null);
export let solver = ref<AmmoType.btSequentialImpulseConstraintSolver | null>(null);
export let physicsWorld = ref<AmmoType.btDiscreteDynamicsWorld | null>(null);
export const dynamicObjects: Mesh[] = [];
export let transformAux1 = ref<AmmoType.btTransform | null>(null);

export let heightData = ref<Float32Array | null>(null);
export let ammoHeightData = ref<number | null>(null);

export const time = ref(0);
export const objectTimePeriod = 1;
export const timeNextSpawn = ref(time.current + objectTimePeriod);
export const maxNumObjects = 1;

// Car
export const springLength = ref(1.3);
export const sprintRate = ref(200);
export const springDamping = ref(3000);
export const wheelRadius = 0.4;
export const tireSnappiness = 150;
export const maxTireForce = ref(300);
export const airResistance = 20;
export const steerPower = 800;
export const enginePower = ref(200);
export const car = ref<Mesh | null>(null);
export const oldCarPosition = ref<THREE.Vector3 | null>(null);
export const carLength = 4;
export const carWidth = 2;
export const carHeight = 1;
export const camFollowDistance = -10;
export const camFollowHeight = 5;

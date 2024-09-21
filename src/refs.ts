import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import { Mesh } from './types';
import { THREE } from './lib/utils/THREE';
import { ref } from './lib/utils/ref';

// Heightfield parameters
export const terrainWidthExtents = 2000;
export const terrainDepthExtents = 2000;
export const terrainWidth = 100;
export const terrainDepth = 100;
export const terrainHalfWidth = terrainWidth / 2;
export const terrainHalfDepth = terrainDepth / 2;
export const terrainMaxHeight = 20;
export const terrainMinHeight = -2;
export const terrainMesh = ref<Mesh | null>(null);
export const heightData = ref<Float32Array | null>(null);
export const ammoHeightData = ref<number | null>(null);

// Graphics variables
export const container = ref<HTMLElement | null>(null);
export const stats = ref<Stats | null>(null);
export const camera = ref<THREE.PerspectiveCamera | null>(null);
export const scene = ref<THREE.Scene | null>(null);
export const renderer = ref<THREE.WebGLRenderer | null>(null);
export const clock = new THREE.Clock();
export const onRender: ((deltaTime: number) => void)[] = [];

// Physics variables
export const collisionConfiguration = ref<AmmoType.btDefaultCollisionConfiguration | null>(null);
export const dispatcher = ref<AmmoType.btCollisionDispatcher | null>(null);
export const broadphase = ref<AmmoType.btDbvtBroadphase | null>(null);
export const solver = ref<AmmoType.btSequentialImpulseConstraintSolver | null>(null);
export const physicsWorld = ref<AmmoType.btDiscreteDynamicsWorld | null>(null);
export const transformAux1 = ref<AmmoType.btTransform | null>(null);

// Car
export const airResistance = ref(10);
export const minAirResistance = 10;
export const steerPower = ref(350);
export const enginePower = ref(200);
export const brakePower = ref(600);
export const brakeRearBias = ref(0.5);
export const angularDamping = 0.99999997;
export const bodyRoll = ref(0.3);
export const car = ref<Mesh | null>(null);
export const oldCarPosition = ref<THREE.Vector3 | null>(null);
export const carLength = 4;
export const carWidth = 2;
export const carHeight = 1;
// TODO turn into single bias value
export const frontWheelDrive = ref(true);
export const rearWheelDrive = ref(true);
export const reverseAngle = Math.PI * 0.8;

// Wheels and suspension
export const maxTireForce = ref(300);
export const springLength = ref(1.3);
export const sprintRate = ref(200);
export const springDamping = ref(4000);
export const wheelRadius = 0.4;
export const tireSnappiness = ref(150);
export const wheelCompression = ref([0, 0, 0, 0]);

export const camFollowDistance = ref(10);
export const camFollowHeight = ref(5);
export const camFollowSpeed = ref(0.05);
export const renderHelperArrows = ref(false);

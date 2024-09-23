import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import { Mesh } from './types';
import { THREE } from './lib/utils/THREE';
import { ref } from './lib/utils/ref';
import { createXYMap } from './lib/utils/createXYMap';

// Heightfield parameters
export const terrainWidthExtents = 2000;
export const terrainDepthExtents = 2000;
export const scale = 0.04;
export const terrainWidth = 50;
export const terrainDepth = 50;
export const terrainHalfWidth = terrainWidth / 2;
export const terrainHalfDepth = terrainDepth / 2;
export const terrainMaxHeight = 30;
export const terrainMinHeight = 0;
export const heightData = ref<Float32Array | null>(null);
export const ammoHeightData = ref<number | null>(null);
export const terrainMesh = ref<Mesh | null>(null);
export const roadMesh = ref<Mesh | null>(null);

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
export const airResistance = ref(0.15);
export const minAirResistance = 10;

// steering
export const steerPower = ref(1500);
export const steerModMap = createXYMap([0, 0], [1, 0.15], [3, 0.3], [30, 1], [100, 0.4]); // x = speed, y = steering input modifier
export const slowSpeedSteerThreshold = 30; // speed under which slow speed steering is used
export const highSpeedSteerThresholdLower = 60; // speed over which high speed steering is used
export const highSpeedSteerThresholdUpper = 100; // speed over which high speed steering is NOT used
export const highSpeedModScalar = 0.05;
export const highSpeedModMax = 1.8;
export const angularDamping = 0.99999997;
export const reverseAngle = Math.PI * 0.8;

// tires and suspension
export const tireGrip = ref(350);
export const springLength = ref(1.1);
export const sprintRate = ref(350);
export const springDamping = ref(5000);
export const wheelRadius = 0.4;
export const tireSnappiness = ref(100);
export const wheelCompression = ref([0, 0, 0, 0]);

// power & brakes
export const enginePower = ref(150);
export const brakePower = ref(600);
export const brakeRearBias = ref(0.5);

// car body
export const bodyRoll = ref(0.5);
export const car = ref<Mesh | null>(null);
export const oldCarPosition = ref<THREE.Vector3 | null>(null);
export const carLength = 4;
export const carWidth = 2;
export const carHeight = 1;
export const frontWheelDrive = ref(true);
export const rearWheelDrive = ref(true);

// camera
export const camFollowDistance = ref(10);
export const camFollowHeight = ref(5);
export const camFollowSpeed = ref(0.05);
export const renderHelperArrows = ref(false);

// export const map = createXYMap([0, 0]);

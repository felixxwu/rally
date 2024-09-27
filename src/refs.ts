import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import { Mesh, Surface, TimeOfDay } from './types';
import { THREE } from './lib/utils/THREE';
import { Ref, ref } from './lib/utils/ref';
import { createXYMap } from './lib/utils/createXYMap';

// Heightfield parameters
export const terrainWidthExtents = 2000;
export const terrainDepthExtents = 2000;
export const scale = 0.04;
export const terrainWidth = 50;
export const terrainDepth = 50;
export const terrainHalfWidth = terrainWidth / 2;
export const terrainHalfDepth = terrainDepth / 2;
export const terrainMaxHeight = 100;
export const terrainMinHeight = 0;
export const heightData = ref<Float32Array | null>(null);
export const ammoHeightData = ref<number | null>(null);
export const terrainMesh = ref<Mesh | null>(null);
export const roadMesh = ref<Mesh | null>(null);
export const grassLeftMesh = ref<Mesh | null>(null);
export const grassRightMesh = ref<Mesh | null>(null);
export const seed = ref(0);
export const seedLevel = ref(8);
export const roadColor = '#888';
export const grassColor = '#4e884e';
export const maxTerrainSlopeX = 5;
export const maxTerrainSlopeZ = 5;

export let temporaryMesh = ref<{ road: THREE.Mesh } | null>(null);

// Road generation
export const maxAngle = 0.032;
export const nearbyDistance = 200;
export const pointMoveDist = 3;
export const numNeightborsToBlur = 20;
export const crossingDistance = 50;
export const maxPoints = 3000;
export const maxAttempts = 8000;
export const halfRoadWidth = 6;
export const startRoadWidth = 20;
export const startRoadLength = 20;
export const grassWidth = 4;
export const maxBankingLength = 30;
export const bankingAngleStart = 0.3;
export const bankingAngleStep = 0.05;

// Graphics variables
export const container = ref<HTMLElement | null>(null);
export const stats = ref<Stats | null>(null);
export const camera = ref<THREE.PerspectiveCamera | null>(null);
export const scene = ref<THREE.Scene | null>(null);
export const renderer = ref<THREE.WebGLRenderer | null>(null);
export const clock = new THREE.Clock();
export const onRender: ((deltaTime: number) => void)[] = [];
export const freeCam = ref(false);

// Physics variables
export const collisionConfiguration = ref<AmmoType.btDefaultCollisionConfiguration | null>(null);
export const dispatcher = ref<AmmoType.btCollisionDispatcher | null>(null);
export const broadphase = ref<AmmoType.btDbvtBroadphase | null>(null);
export const solver = ref<AmmoType.btSequentialImpulseConstraintSolver | null>(null);
export const physicsWorld = ref<AmmoType.btDiscreteDynamicsWorld | null>(null);
export const transformAux1 = ref<AmmoType.btTransform | null>(null);
export const gravity = 35;

// steering
export const steerPower = ref(3000, 2000, 5000, 100);
export const steerModMap = createXYMap([0, 0], [1, 0.4], [3, 0.5], [30, 1], [100, 0.4]); // x = speed, y = steering input modifier
export const angularDamping = 0.99999997;
export const reverseAngle = Math.PI * 0.8;

// tires and suspension
export const tireGrip = ref(200, 0, 1000, 10);
export const springLength = ref(1.1, 0.5, 3, 0.01);
export const sprintRate = ref(300, 0, 600, 10);
export const springDamping = ref(5000, 0, 15000, 100);
export const wheelRadius = 0.4;
export const wheelWidth = 0.3;
export const tireSnappiness = ref(100, 50, 200, 1);
export const wheelCompression = ref([0, 0, 0, 0]);

// power & brakes
export const enginePower = ref(100, 0, 500, 10);
export const brakePower = ref(200, 0, 1200, 100);
export const brakeRearBias = ref(0.5, 0, 1, 0.01);

// surface grips
export const surfaceGrips: {
  [key in Surface]: { ref: Ref<number>; colour: string; opacity: number };
} = {
  tarmac: { ref: ref(2, 0, 3, 0.1), colour: '#000', opacity: 1 },
  grass: { ref: ref(0.6, 0, 3, 0.1), colour: '#040', opacity: 0.3 },
};
export const showSkidMarkThreshold = 0.35;
export const skidMarkIntensity = 5;
export const skidMarkOpacity = 0.5;
export const maxSkidMarks = 200;

// car physics
export const bodyRoll = ref(0.6, 0, 1, 0.1);
export const airResistance = ref(0.15, 0.1, 0.5, 0.01);
export const minAirResistance = 10;
export const car = ref<Mesh | null>(null);
export const carLength = 4.2;
export const carWidth = 2;
export const carHeight = 1;
export const wheelEndOffset = 0.2;
export const frontWheelDrive = ref(true);
export const rearWheelDrive = ref(true);

// camera
export const camFollowDistance = ref(6, 3, 30, 1);
export const camFollowHeight = ref(7, 0, 30, 1);
export const camFollowSpeed = ref(0.2, 0, 1, 0.01);

// sky
export const carLightIntensity = 500;
export const timeOfDay = ref<TimeOfDay>('Day');
export const lightValues: {
  [key in TimeOfDay]: {
    light: number;
    ambient: number;
    lightAngle: number;
    sunElevation: number;
    color: number;
  };
} = {
  Day: {
    light: 2.5,
    ambient: 1,
    lightAngle: 45,
    sunElevation: 45,
    color: 0xffffff,
  },
  Sunset: {
    light: 2.7,
    ambient: 1.2,
    lightAngle: 5,
    sunElevation: 0,
    color: 0xffaa88,
  },
  Night: {
    light: 0,
    ambient: 0.7,
    lightAngle: 90,
    sunElevation: -90,
    color: 0x222222,
  },
};

// debug
export const renderHelperArrows = ref(false);
export const renderHitCarBox = ref(false);

// UI
export const panelOpen = ref(false);
export const startGame = ref(false);
export const raycasterOffset = 2;

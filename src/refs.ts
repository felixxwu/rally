import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import { Menu, Mesh, Surface, TimeOfDay } from './types';
import { THREE } from './lib/utils/THREE';
import { Ref, ref } from './lib/utils/ref';
import { createXYMap } from './lib/utils/createXYMap';
import { Vector } from './lib/road/createRoadShape';

// immediately start a game
export const devMode = false;

// Heightfield parameters
export const terrainWidthExtents = 2000;
export const terrainDepthExtents = 2000;
export const scale = 0.04;
export const terrainWidth = 50;
export const terrainDepth = 50;
export const terrainHalfWidth = terrainWidth / 2;
export const terrainHalfDepth = terrainDepth / 2;
export const terrainMaxHeight = 120;
export const terrainHeightExponent = 1.5; // higher = bias towards lower heights
export const terrainMinHeight = 0;
export const heightData = ref<Float32Array | null>(null);
export const ammoHeightData = ref<number | null>(null);
export const terrainMesh = ref<Mesh | null>(null);
export const roadMesh = ref<Mesh | null>(null);
export const grassLeftMesh = ref<Mesh | null>(null);
export const grassRightMesh = ref<Mesh | null>(null);
export const seed = ref(Math.floor(Math.random() * 1000));
export const seedLevel = ref(8);
export const roadColor = '#888';
export const grassColor = '#4e884e';
export const maxTerrainSlopeX = 6;
export const maxTerrainSlopeZ = 6;

export let temporaryMesh = ref<{ road: THREE.Mesh } | null>(null);

// Road generation
export const maxPoints = devMode ? 1000 : 3000;
export const maxAttempts = 7000;
export const maxAngle = 0.04;
export const nearbyDistance = 200;
export const pointMoveDist = 3;
export const horizontalRoadSmoothing = 50;
export const verticalRoadSmoothing = 20;
export const crossingDistance = 50;
export const halfRoadWidth = 6;
export const startRoadWidth = 20;
export const startRoadLength = 30;
export const grassWidth = 4;
export const maxBankingLength = 30;
export const bankingAngleStart = 0.3;
export const bankingAngleStep = 0.05;
export const roadVecs = ref<Vector[]>([]);
export const resetDistance = 30;
export const progress = ref(0);

// Graphics variables
export const container = ref<HTMLElement | null>(null);
export const stats = ref<Stats | null>(null);
export const camera = ref<THREE.PerspectiveCamera | null>(null);
export const scene = ref<THREE.Scene | null>(null);
export const renderer = ref<THREE.WebGLRenderer | null>(null);
export const clock = new THREE.Clock();
// make ref?
export const onRender: ((deltaTime: number) => void)[] = [];
export const onRenderNoPausing: ((deltaTime: number) => void)[] = [];
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
export const steerPower = ref(1100, 500, 2000, 100);
export const steerModMap = createXYMap([0, 0], [1, 0], [2, 0.6], [20, 1], [50, 0.6]); // x = speed, y = steering input modifier
export const angularDamping = 0.97;
export const reverseAngle = Math.PI * 0.8;

// tires and suspension
export const tireGrip = ref(150, 0, 1000, 10);
export const springLength = ref(1.1, 0.5, 3, 0.01);
export const sprintRate = ref(350, 0, 600, 10);
export const springDamping = ref(5000, 0, 15000, 100);
export const wheelRadius = 0.4;
export const wheelWidth = 0.3;
export const tireSnappiness = ref(100, 50, 200, 1);
export const wheelCompression = ref([0, 0, 0, 0]);

// power & brakes
export const enginePower = ref(100, 0, 500, 10);
export const brakePower = ref(550, 0, 1200, 100);
export const brakeRearBias = ref(0.6, 0, 1, 0.01);

// surface grips
export const surfaceGrips: {
  [key in Surface]: { dry: Ref<number>; colour: string; opacity: number };
} = {
  tarmac: { dry: ref(1.7, 0, 3, 0.1), colour: '#000', opacity: 0.5 },
  grass: { dry: ref(0.9, 0, 3, 0.1), colour: '#040', opacity: 0.2 },
};
export const skidMarkIntensity = 0.004;
export const maxSkidMarks = 200;

// car physics
export const bodyRoll = ref(0.5, 0, 1, 0.1);
export const airResistance = ref(0.15, 0.1, 0.5, 0.01);
export const minAirResistance = 10;
export const car = ref<Mesh | null>(null);
export const carLength = 4.2;
export const carWidth = 2;
export const carHeight = 1;
export const wheelEndOffset = 0.2;
export const driveTrain = ref<'FWD' | 'RWD' | 'AWD'>('AWD');

// camera
export const camFollowDistance = ref(5, 3, 30, 1);
export const camFollowHeight = ref(5, 0, 30, 1);
export const camFollowSpeed = ref(0.1, 0, 1, 0.01);
export const fov = 90;

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
    ambient: 0.8,
    lightAngle: 45,
    sunElevation: 45,
    color: 0xffffff,
  },
  Sunset: {
    light: 2.7,
    ambient: 1.3,
    lightAngle: 5,
    sunElevation: 0,
    color: 0xffaa88,
  },
  Night: {
    light: 0,
    ambient: 1.3,
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
export const stageTime = ref(0);
export const stageTimeStarted = ref(false);
export const countDown = ref(0);
export const currentMenu = ref<Menu>(devMode ? 'hud' : 'splash');
export const defaultTransitionTime = 1000;
export const transitionTime = ref(defaultTransitionTime);
export const gamePaused = ref(false);

// controls
export const keysDownMobile = ref<Record<string, boolean>>({});
export const keysDown = ref<Record<string, boolean>>({});
export const internalController = ref({
  steer: 0,
  throttle: 0,
  brake: 0,
  handbrake: 0,
  reset: false,
});

export const stopInternalController = ref(false);
export const menuUp = ref(false);
export const menuDown = ref(false);
export const menuLeft = ref(false);
export const menuRight = ref(false);
export const menuSelect = ref(false);
export const menuBack = ref(false);
export const menuPause = ref(false);

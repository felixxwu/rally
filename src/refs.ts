import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import { Menu, Mesh, Surface, TimeOfDay } from './types';
import { THREE } from './lib/utils/THREE';
import { Ref, ref } from './lib/utils/ref';
import { createXYMap } from './lib/utils/createXYMap';
import { Vector } from './lib/road/createRoadShape';
import { Car } from './lib/carList';
import { cooper } from './lib/carList/Cooper';

// immediately start a game
export const devMode = false;
export const selectedCar = ref<Car>(cooper);

export const caches: Ref<any>[] = [];

// Heightfield parameters
export const terrainWidthExtents = 3000;
export const terrainDepthExtents = 3000;
export const scale = 0.04;
export const terrainWidth = 40;
export const terrainDepth = 40;
export const terrainMaxHeight = 120;
export const terrainHeightExponent = 1.3; // higher = bias towards lower heights
export const terrainMinHeight = 0;
export const heightData = ref<Float32Array | null>(null);
export const ammoHeightData = ref<number | null>(null);
export const terrainMesh = ref<Mesh | null>(null);
export const localTerrainMesh = ref<Mesh | null>(null);
export const roadMesh = ref<Mesh | null>(null);
export const grassLeftMesh = ref<Mesh | null>(null);
export const grassRightMesh = ref<Mesh | null>(null);
export const localRoadMesh = ref<Mesh | null>(null);
export const localGrassLeftMesh = ref<Mesh | null>(null);
export const localGrassRightMesh = ref<Mesh | null>(null);
export const platformMesh = ref<Mesh | null>(null);
export const seed = ref(Math.floor(Math.random() * 1000));
export const seedLevel = ref(8);
export const roadColor = '#888';
export const grassColor = '#4e884e';
export const maxTerrainSlopeX = 6;
export const maxTerrainSlopeZ = 6;

export let temporaryMesh = ref<{ road: THREE.Mesh } | null>(null);

// Road generation
export const maxPoints = devMode ? 1000 : 4000;
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
export const grassWidth = 3;
export const maxBankingLength = 50;
export const bankingAngleStart = 0.5;
export const bankingAngleStep = 0.05;
export const roadVecs = ref<Vector[]>([]);
export const resetDistance = 40;
export const progress = ref(0);

// Graphics variables
export const container = ref<HTMLElement | null>(null);
export const stats = ref<Stats | null>(null);
export const camera = ref<THREE.PerspectiveCamera | null>(null);
export const scene = ref<THREE.Scene | null>(null);
export const renderer = ref<THREE.WebGLRenderer | null>(null);
export const clock = new THREE.Clock();
export const stageTimeClock = new THREE.Clock();
export const onRender = ref<[string, (deltaTime: number) => void][]>([]);
export const onRenderNoPausing = ref<((deltaTime: number) => void)[]>([]);
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
export const steerModMap = createXYMap([0, 0], [1, 0], [2, 0.4], [15, 1], [50, 0.5]); // x = speed, y = steering input modifier
export const reverseAngle = Math.PI * 0.8;

// tires and suspension
export const tireSnappiness = ref(100, 50, 200, 1);
export const wheelCompression = ref([0, 0, 0, 0]);
export const wheelSurfaces = ref<[Surface, Surface, Surface, Surface]>([
  'tarmac',
  'tarmac',
  'tarmac',
  'tarmac',
]);

// surface grips
export const surfaceGrips: {
  [key in Surface]: { dry: Ref<number>; colour: string; opacity: number };
} = {
  tarmac: { dry: ref(1.8, 0, 3, 0.1), colour: '#000', opacity: 0.5 },
  grass: { dry: ref(1.3, 0, 3, 0.1), colour: '#040', opacity: 0.2 },
};
export const skidMarkIntensity = 0.004;
export const maxSkidMarks = 200;

// car
export const minAirResistance = 15;
export const car = ref<Mesh | null>(null);
export const angularDamping = 0.998;
export const powerModifier = 0.5; // scale all car power by this amount

// camera
export const camFollowDistance = ref(5, 3, 30, 1);
export const camFollowHeight = ref(2.5, 0, 30, 1);
export const camFollowSpeed = ref(0.15, 0, 1, 0.01);
export const fov = 90;
export const carVisible = ref(false);

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
export const generatingTerrain = ref(false);
export const carSelected = ref(false);
export const raycasterOffset = 1.5;
export const stageTime = ref(0);
export const stageTimeStarted = ref(false);
export const countDownStarted = ref(false);
export const currentMenu = ref<Menu>(devMode ? 'carSelect' : 'splash');
export const defaultTransitionTime = 1000;
export const transitionTime = ref(defaultTransitionTime);
export const stopOnRender = ref(false);
export const infoText = ref('');

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

// internal controller
export const stopInternalController = ref(false);
export const menuUp = ref(false);
export const menuDown = ref(false);
export const menuLeft = ref(false);
export const menuRight = ref(false);
export const menuSelect = ref(false);
export const menuBack = ref(false);
export const menuPause = ref(false);

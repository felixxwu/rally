import AmmoType from 'ammojs-typed';

import Stats from './lib/jsm/stats.module';
import {
  Menu,
  Mesh,
  Surface,
  SurfaceProperties,
  TimeOfDay,
  timeOfDayOptions,
  Weather,
  weatherOptions,
} from './types';
import { THREE } from './lib/utils/THREE';
import { Ref, ref } from './lib/utils/ref';
import { createXYMap } from './lib/utils/createXYMap';
import { Vector } from './lib/road/createRoadShape';
import { Car } from './lib/carList/carList';
import { MiniCooper } from './lib/carList/MiniCooper';

// immediately start a game
export const devMode = false;
export const selectedCar = ref<Car>(MiniCooper);

export const caches: Ref<any>[] = [];

// Height field parameters
export const mapWidth = 4000;
export const mapHeight = 4000;
export const scale = 0.04;
export const mapWidthSegments = 100;
export const mapHeightSegments = 100;
export const terrainMaxHeight = 90;
export const terrainHeightExponent = 1.8; // higher = bias towards lower heights
export const terrainMinHeight = 10;
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
export const maxTerrainSlopeX = 4;
export const maxTerrainSlopeZ = 4;

export let temporaryMesh = ref<{ road: THREE.Mesh } | null>(null);

// Road generation
export const maxPoints = 4000;
export const maxAttempts = 7000;
export const maxAngle = 0.05;
export const maxIncline = 0.5;
export const nearbyDistance = 200;
export const pointMoveDist = 3;
export const horizontalRoadSmoothing = 50;
export const verticalRoadSmoothing = 5;
export const crossingDistance = 50;
export const halfRoadWidth = 9;
export const startRoadWidth = 20;
export const startRoadLength = 30;
export const grassWidth = 3;
export const maxBankingLength = 200;
export const bankingAngle = 0.6;
export const roadVecs = ref<Vector[]>([]);
export const resetDistance = 40;
export const progress = ref(0);

// Graphics variables
export const container = ref<HTMLElement | null>(null);
export const stats = ref<Stats | null>(null);
export const camera = ref<THREE.PerspectiveCamera | null>(null);
export const scene = ref<THREE.Scene | null>(null);
export const renderer = ref<THREE.WebGLRenderer | null>(null);
export const resolutionScale = 0.25;
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
export const fps = ref(60);

// steering
export const steerModMap = createXYMap([0, 0], [1, 0], [5, 1], [50, 0.7]); // x = speed, y = steering input modifier
export const reverseAngle = Math.PI * 0.8;

// tires and suspension
export const tireSnappiness = ref(100, 50, 200, 1);
export const suspensionForces = ref([0, 0, 0, 0]);
export const wheelSurfaces = ref<[Surface, Surface, Surface, Surface]>([
  'tarmac',
  'tarmac',
  'tarmac',
  'tarmac',
]);
export const skidMarkOpacities = ref([0, 0, 0, 0]);

// surface grips
export const surfaceGrips: {
  [key in Surface]: SurfaceProperties;
} = {
  tarmac: { clear: 1.8, rain: 1.4, fog: 1.7, colour: '#000', skidMarkOpacity: 0.5 },
  grass: { clear: 1.5, rain: 1, fog: 1.4, colour: '#040', skidMarkOpacity: 0.2 },
};
export const skidMarkIntensity = 0.004;
export const maxSkidMarks = 50;

// car
export const minAirResistance = 15;
export const car = ref<Mesh | null>(null);
export const angularDamping = 0.99999997;
export const powerModifier = 1.2; // scale all car power by this amount
export const gear = ref(0);
export const shifting = ref<null | { start: number; oldGear: number }>(null);
export const listener = ref(new THREE.AudioListener());
export const sound = ref(new THREE.Audio(listener.current));
export const soundOff = ref(new THREE.Audio(listener.current));
export const tarmacSound = ref(new THREE.Audio(listener.current));
export const grassSound = ref(new THREE.Audio(listener.current));
export const gravelSound = ref(new THREE.Audio(listener.current));
export const skidSound = ref(new THREE.Audio(listener.current));
export const shiftingMode = ref<'manual' | 'auto'>('auto');

// camera
export const camFollowDistance = ref(6, 3, 30, 1);
export const camFollowHeight = ref(3, 0, 30, 1);
export const camFollowSpeed = ref(0.15, 0, 1, 0.01);
export const fov = 80;
export const carVisible = ref(false);

// sky
export const carLightIntensity = 500;
export const weather = ref<Weather>(weatherOptions[0]);
export const timeOfDay = ref<TimeOfDay>(timeOfDayOptions[0]);
export const lightValues: {
  [key in TimeOfDay['time']]: {
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

// houses
export const houseRenderDistance = ref(200, 50, 1000, 10); // Distance at which houses stop rendering

// trees
export const treeRenderDistance = ref(200, 50, 1000, 10); // Distance at which trees stop rendering

// UI
export const panelOpen = ref(false);
export const generatingTerrain = ref(false);
export const carSelected = ref(false);
export const raycasterOffset = 3;
export const stageTime = ref(0);
export const stageTimeStarted = ref(false);
export const countDownStarted = ref(false);
export const currentMenu = ref<Menu>('splash');
export const defaultTransitionTime = 1000;
export const transitionTime = ref(defaultTransitionTime);
export const stopOnRender = ref(false);
export const infoText = ref('');
export const infoTextOnClick = ref<() => void>(() => {});
export const mobileInput = ref<'combined' | 'separate' | 'buttons'>('buttons');

// controls
export const mobileJoystickPad = ref({ x: 0.5, y: 0.5 });
export const mobileButtons = ref({ left: false, brake: false, right: false });
export const keysDown = ref<Record<string, boolean>>({});
export const internalController = ref({
  steer: 0,
  throttle: 0,
  brake: 0,
  handbrake: 0,
  reset: false,
  gearUp: false,
  gearDown: false,
});
export const controllerOS = ref<'windows' | 'macos'>('windows');

// internal controller
export const stopInternalController = ref(false);
export const menuUp = ref(false);
export const menuDown = ref(false);
export const menuLeft = ref(false);
export const menuRight = ref(false);
export const menuSelect = ref(false);
export const menuBack = ref(false);
export const menuPause = ref(false);

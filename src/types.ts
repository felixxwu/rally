import { THREE } from './lib/utils/THREE';

export type Mesh = THREE.Mesh<THREE.BufferGeometry, THREE.Material, THREE.Object3DEventMap>;

export type TimeOfDay = { time: 'Day' | 'Sunset' | 'Night'; fogColor: number };
export const timeOfDayOptions = [
  { time: 'Day', fogColor: 0xaaaaaa },
  { time: 'Sunset', fogColor: 0x222222 },
  { time: 'Night', fogColor: 0x111111 },
] as TimeOfDay[];

export type Surface = 'tarmac' | 'grass';

export type Menu =
  | 'main'
  | 'stageSelect'
  | 'splash'
  | 'hud'
  | 'pause'
  | 'settings'
  | 'stageEnd'
  | 'carSelect';

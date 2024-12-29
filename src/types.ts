import { THREE } from './lib/utils/THREE';

export type Mesh = THREE.Mesh<THREE.BufferGeometry, THREE.Material, THREE.Object3DEventMap>;

export type TimeOfDay = 'Day' | 'Sunset' | 'Night';
export const timeOfDayOptions = ['Day', 'Sunset', 'Night'] as TimeOfDay[];

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

import { selectedCar } from '../../refs';
import { carCleanUp, initCar } from '../car/initCar';
import { initWheel, wheelCleanUp } from '../wheel/initWheel';
import { meanie } from './Meanie';
import { charger } from './Charger';
import { cyber } from './Cyber';

export type Car = {
  name: string;
  glb: string;
  width: number;
  height: number;
  length: number;
  wheelRadius: number;
  wheelWidth: number;
  wheelEndOffset: number;
  mass: number; // 10 = 1000kg
  power: number;
  steerPower: number;
  tireGrip: number;
  brakePower: number;
  brakeRearBias: number;
  driveTrain: 'FWD' | 'RWD' | 'AWD';
  springLength: number;
  springRate: number;
  springDamping: number;
  bodyRoll: number;
  airResistance: number;
};

export async function selectCar(newCar: Car) {
  selectedCar.current = newCar;
  carCleanUp.cleanup();
  await initCar();
  wheelCleanUp.cleanup();
  initWheel(true, true);
  initWheel(true, false);
  initWheel(false, true);
  initWheel(false, false);
}

export const allCars: Car[] = [meanie, charger, cyber];

export function nextCar() {
  const index = allCars.findIndex(car => car === selectedCar.current);
  selectCar(allCars[(index + 1) % allCars.length]);
}

export function prevCar() {
  const index = allCars.findIndex(car => car === selectedCar.current);
  selectCar(allCars[(index - 1 + allCars.length) % allCars.length]);
}

import { selectedCar } from '../../refs';
import { carCleanUp, initCar } from '../car/initCar';
import { initWheel, wheelCleanUp } from '../wheel/initWheel';
import { MiniCooper } from './MiniCooper';
import { DodgeCharger } from './DodgeCharger';
import { TeslaCybertruck } from './TeslaCybertruck';
import { XYMap } from '../utils/createXYMap';

export type Car = {
  name: string;
  glb: string;
  engineSound: string;
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
  finalDrive: number; // speed * masterGearRatio * gears[number] = RPM
  gears: number[]; // power * powerModifier * torqueCurve@RPM * gears[number] = wheel power
  torqueCurve: XYMap; // multiplier for power (0-1)
  redline: number;
  shiftTime: number; // ms
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

export const allCars: Car[] = [MiniCooper, DodgeCharger, TeslaCybertruck];

export async function nextCar() {
  const index = allCars.findIndex(car => car === selectedCar.current);
  await selectCar(allCars[(index + 1) % allCars.length]);
}

export async function prevCar() {
  const index = allCars.findIndex(car => car === selectedCar.current);
  await selectCar(allCars[(index - 1 + allCars.length) % allCars.length]);
}

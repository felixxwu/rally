import { selectedCar } from '../../refs';
import { carCleanUp, initCar } from '../car/initCar';
import { initWheel, wheelCleanUp } from '../wheel/initWheel';
import { car1 } from './Car1';
import { car2 } from './Car2';

export type Car = {
  name: string;
  width: number;
  height: number;
  length: number;
  wheelRadius: number;
  wheelWidth: number;
  wheelEndOffset: number;
  mass: number;
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

export function selectCar(newCar: Car) {
  selectedCar.current = newCar;
  carCleanUp.cleanup();
  initCar();
  wheelCleanUp.cleanup();
  initWheel(true, true);
  initWheel(true, false);
  initWheel(false, true);
  initWheel(false, false);
}

export const allCars: Car[] = [car1, car2];

export function nextCar() {
  const index = allCars.findIndex(car => car === selectedCar.current);
  selectCar(allCars[(index + 1) % allCars.length]);
}

export function prevCar() {
  const index = allCars.findIndex(car => car === selectedCar.current);
  selectCar(allCars[(index - 1 + allCars.length) % allCars.length]);
}

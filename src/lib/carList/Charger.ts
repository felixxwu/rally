import { Car } from '.';
import { createXYMap } from '../utils/createXYMap';

export const charger: Car = {
  name: 'Dodge Charger',
  glb: 'charger',
  width: 1.6,
  height: 0.9,
  length: 3.7,
  wheelRadius: 0.33,
  wheelWidth: 0.3,
  wheelEndOffset: 0,
  mass: 16.33,
  power: 295,
  steerPower: 2.7,
  tireGrip: 0.5,
  brakePower: 400,
  brakeRearBias: 0.4,
  driveTrain: 'RWD',
  springLength: 1.1,
  springRate: 350,
  springDamping: 5000,
  bodyRoll: 0.5,
  airResistance: 0.1,
  finalDrive: 300,
  gears: [1, 0.5, 0.35, 0.25],
  torqueCurve: createXYMap([0, 0.5], [4000, 1], [5000, 1], [8000, 0]),
  redline: 7000,
};

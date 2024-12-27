import { Car } from '.';
import { createXYMap } from '../utils/createXYMap';

export const cooper: Car = {
  name: 'Austin Cooper',
  glb: 'cooper',
  width: 1.3,
  height: 1,
  length: 2.7,
  wheelRadius: 0.28,
  wheelWidth: 0.2,
  wheelEndOffset: 0,
  mass: 6.52,
  power: 60,
  steerPower: 2,
  tireGrip: 0.6,
  brakePower: 200,
  brakeRearBias: 0.6,
  driveTrain: 'FWD',
  springLength: 0.9,
  springRate: 200,
  springDamping: 2000,
  bodyRoll: 0.3,
  airResistance: 0.05,
  finalDrive: 300,
  gears: [1, 0.5, 0.35, 0.25],
  torqueCurve: createXYMap([0, 0.5], [3000, 1], [6000, 1], [8000, 0]),
  redline: 7000,
};

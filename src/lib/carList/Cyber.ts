import { Car } from '.';
import { createXYMap } from '../utils/createXYMap';

export const cyber: Car = {
  name: 'Tesla CyberTruck',
  glb: 'cyber',
  width: 1.75,
  height: 1.5,
  length: 4.6,
  wheelRadius: 0.44,
  wheelWidth: 0.28,
  wheelEndOffset: 0,
  mass: 30.2,
  power: 600,
  steerPower: 3.2,
  tireGrip: 0.4,
  brakePower: 400,
  brakeRearBias: 0.4,
  driveTrain: 'AWD',
  springLength: 1.1,
  springRate: 950,
  springDamping: 7000,
  bodyRoll: 1,
  airResistance: 0.2,
  finalDrive: 170,
  gears: [1],
  torqueCurve: createXYMap([0, 1], [4000, 1], [7000, 0.5], [12000, 0.15]),
  redline: 12000,
};

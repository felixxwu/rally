import { createXYMap } from '../utils/createXYMap';
import { Car } from './carList';

export const TeslaCybertruck: Car = {
  name: 'Tesla Cybertruck',
  glb: 'TeslaCybertruck',
  engineSound: 'ev.wav',
  engineOffSound: 'ev-off.wav',
  engineVolume: 0.2,
  recordedRPM: 4000,
  idleRPM: 0,
  width: 1.75,
  height: 1.5,
  length: 4.6,
  wheelRadius: 0.44,
  wheelWidth: 0.28,
  wheelEndOffset: 0,
  mass: 3020,
  power: 600,
  steerPower: 3.2,
  tireGrip: 0.4,
  brakePower: 400,
  brakeRearBias: 0.6,
  driveTrain: 'AWD',
  springLength: 1.1,
  springRate: 950,
  springDamping: 7000,
  bodyRoll: 1.5,
  drag: 0.25,
  downforceFront: 0.01,
  downforceRear: 0,
  finalDrive: 160,
  gears: [1],
  torqueCurve: createXYMap([0, 1], [4000, 1], [7000, 0.35], [12000, 0.15]),
  redline: 12000,
  shiftTime: 0,
};

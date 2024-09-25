import { initCarLight } from './initCarLight';
import { initSun } from './initSun';

export const initLight = () => {
  initSun();
  initCarLight(true);
  initCarLight(false);
};

import { THREE } from './THREE';

export function mult(a: THREE.Vector3, x: number) {
  return a.clone().multiplyScalar(x);
}

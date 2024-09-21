import { THREE } from './THREE';

export function add(a: THREE.Vector3, b: [number, number, number]) {
  return a.clone().add(new THREE.Vector3(b[0], b[1], b[2]));
}

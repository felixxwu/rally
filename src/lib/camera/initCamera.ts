import { camera, onRender, renderer } from '../../constant'
import { updateCamera } from './updateCamera'
import { THREE } from '../utils/THREE'

export function initCamera() {
  camera.current = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  )

  onRender.push(updateCamera)
}

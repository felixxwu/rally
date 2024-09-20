import { camera, renderer } from '../constant'

export let keysDown: Record<string, boolean> = {}

export function initWindowListeners() {
  window.onresize = onWindowResize
  window.onkeydown = onKeyDown
  window.onkeyup = onKeyUp
}

function onWindowResize() {
  if (!camera.current) return

  camera.current.aspect = window.innerWidth / window.innerHeight
  camera.current.updateProjectionMatrix()

  renderer.current?.setSize(window.innerWidth, window.innerHeight)
}

function onKeyDown(event: KeyboardEvent) {
  keysDown[event.key] = true
}

function onKeyUp(event: KeyboardEvent) {
  keysDown[event.key] = false
}

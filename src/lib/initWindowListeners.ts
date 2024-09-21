import { camera, renderer } from '../constant'

export let keysDown: Record<string, boolean> = {}
export let mobileInput: { left?: boolean; right?: boolean } = {}

export function initWindowListeners() {
  window.onresize = onWindowResize
  window.onkeydown = onKeyDown
  window.onkeyup = onKeyUp

  document.getElementById('left')?.addEventListener('touchstart', () => (mobileInput.left = true))
  document.getElementById('left')?.addEventListener('touchend', () => (mobileInput.left = false))
  document.getElementById('right')?.addEventListener('touchstart', () => (mobileInput.right = true))
  document.getElementById('right')?.addEventListener('touchend', () => (mobileInput.right = false))
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

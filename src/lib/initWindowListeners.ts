import { camera, renderer } from '../constant'

export let keysDown: Record<string, boolean> = {}

export function initWindowListeners() {
  window.onresize = onWindowResize
  window.onkeydown = onKeyDown
  window.onkeyup = onKeyUp

  addPointerListeners('up', 'w')
  addPointerListeners('down', 's')
  addPointerListeners('left', 'a')
  addPointerListeners('right', 'd')
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

function addPointerListeners(id: string, key: string) {
  document.getElementById(id)?.addEventListener('pointerdown', e => handlePointerDown(e, key))
  document.getElementById(id)?.addEventListener('pointerup', e => handlePointerUp(e, key))
  document.getElementById(id)?.addEventListener('pointerleave', e => handlePointerUp(e, key))
  document.getElementById(id)?.addEventListener('pointercancel', e => handlePointerUp(e, key))
  document.getElementById(id)?.addEventListener('pointerout', e => handlePointerUp(e, key))
}

function handlePointerDown(event: PointerEvent, key: string) {
  event.preventDefault()
  keysDown[key] = true
}

function handlePointerUp(event: PointerEvent, key: string) {
  event.preventDefault()
  keysDown[key] = false
}

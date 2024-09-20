import {
  clock,
  dynamicObjects,
  maxNumObjects,
  time,
  timeNextSpawn,
  objectTimePeriod,
  renderer,
  scene,
  camera,
} from '../constant'
import { generateObject } from './generateObject'
import { updatePhysics } from './updatePhysics'

export function render() {
  const deltaTime = clock.getDelta()

  if (dynamicObjects.length < maxNumObjects && time.current > timeNextSpawn.current) {
    generateObject()
    timeNextSpawn.current = time.current + objectTimePeriod
  }

  updatePhysics(deltaTime)

  renderer.current?.render(scene.current!, camera.current!)

  time.current += deltaTime
}

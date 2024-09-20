import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import { initPhysics } from './lib/physics/initPhysics'
import { initGraphics } from './lib/initGraphics'
import { initCar } from './lib/car/initCar'
import { initTerrain } from './lib/terrain/initTerrain'
import { initRenderer } from './lib/render/initRenderer'
import { initLight } from './lib/initLight'
import { initHelperArrows } from './lib/helperArrows/initHelperArrows'
import { initCamera } from './lib/camera/initCamera'
import { initWindowListeners } from './lib/initWindowListeners'
import { initWheel } from './lib/wheel/initWheel'

Ammo().then(() => {
  initGraphics()
  initRenderer()
  initCamera()
  initLight()
  initTerrain()
  initPhysics()
  initCar()
  initWheel(true, true)
  initWheel(true, false)
  initWheel(false, true)
  initWheel(false, false)
  initHelperArrows()
  initWindowListeners()
})

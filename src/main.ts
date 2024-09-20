import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import { generateHeight } from './lib/generateHeight'
import { initPhysics } from './lib/initPhysics'
import {
  heightData,
  terrainDepth,
  terrainMaxHeight,
  terrainMinHeight,
  terrainWidth,
} from './constant'
import { initGraphics } from './lib/initGraphics'

Ammo().then(() => {
  heightData.current = generateHeight(
    terrainWidth,
    terrainDepth,
    terrainMinHeight,
    terrainMaxHeight
  )
  initGraphics()
  initPhysics()
})

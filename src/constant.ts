import AmmoType from 'ammojs-typed'

import Stats from './lib/jsm/stats.module'
import { Mesh } from './types'
import { THREE } from './lib/utils/THREE'

// Heightfield parameters
export const terrainWidthExtents = 300
export const terrainDepthExtents = 300
export const terrainWidth = 128
export const terrainDepth = 128
export const terrainHalfWidth = terrainWidth / 2
export const terrainHalfDepth = terrainDepth / 2
export const terrainMaxHeight = 5
export const terrainMinHeight = -2

export const onRender: ((deltaTime: number) => void)[] = []

// Graphics variables
export const container = constant<HTMLElement | null>(null)
export let stats = constant<Stats | null>(null)
export let camera = constant<THREE.PerspectiveCamera | null>(null)
export let scene = constant<THREE.Scene | null>(null)
export let renderer = constant<THREE.WebGLRenderer | null>(null)
export let terrainMesh = constant<Mesh | null>(null)
export const clock = new THREE.Clock()

// Physics variables
export let collisionConfiguration = constant<AmmoType.btDefaultCollisionConfiguration | null>(null)
export let dispatcher = constant<AmmoType.btCollisionDispatcher | null>(null)
export let broadphase = constant<AmmoType.btDbvtBroadphase | null>(null)
export let solver = constant<AmmoType.btSequentialImpulseConstraintSolver | null>(null)
export let physicsWorld = constant<AmmoType.btDiscreteDynamicsWorld | null>(null)
export const dynamicObjects: Mesh[] = []
export let transformAux1 = constant<AmmoType.btTransform | null>(null)

export let heightData = constant<Float32Array | null>(null)
export let ammoHeightData = constant<number | null>(null)

export const time = constant(0)
export const objectTimePeriod = 1
export const timeNextSpawn = constant(time.current + objectTimePeriod)
export const maxNumObjects = 1

export function constant<T>(init: T) {
  return {
    current: init,
  }
}

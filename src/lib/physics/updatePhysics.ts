import { transformAux1 } from '../../constant'
import { getUserData } from '../utils/userData'
import { Mesh } from '../../types'

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody
  const ms = objPhys.getMotionState()
  if (ms && transformAux1.current) {
    ms.getWorldTransform(transformAux1.current)
    const p = transformAux1.current?.getOrigin()
    const q = transformAux1.current?.getRotation()
    objThree.position.set(p?.x() ?? 0, p?.y() ?? 0, p?.z() ?? 0)
    objThree.quaternion.set(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0)
  }
}

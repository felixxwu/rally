import Ammo from 'ammojs-typed'
import { Mesh } from '../../types'

type UserData = {
  physicsBody: Ammo.btRigidBody
}

export function setUserData(mesh: Mesh, data: UserData) {
  mesh.userData.physicsBody = data.physicsBody
}

export function getUserData(mesh: Mesh): UserData {
  return mesh.userData as UserData
}

import Ammo from 'ammojs-typed'

type UserData = {
  physicsBody: Ammo.btRigidBody
}

export function setUserData(userData: Record<string, any>, data: UserData) {
  userData.physicsBody = data.physicsBody
}

export function getUserData(userData: Record<string, any>): UserData {
  return userData as UserData
}

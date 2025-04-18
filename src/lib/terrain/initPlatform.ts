import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { physicsWorld, platformMesh, scene, mapHeight, mapWidth } from '../../refs';
import { THREE } from '../utils/THREE';

export function initPlatform() {
  const geometry = new THREE.PlaneGeometry(mapWidth, mapHeight, 1, 1);
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 1,
    metalness: 0,
    opacity: 0.5,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, groundMaterial);
  mesh.receiveShadow = true;
  scene.current?.add(mesh);
  platformMesh.current = mesh;

  const shape = new Ammo.btBoxShape(new Ammo.btVector3(mapWidth, 0.5, mapHeight));
  const groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  groundTransform.setOrigin(new Ammo.btVector3(0, 0, 0));
  const groundMass = 0;
  const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
  const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
  const rigidBody = new Ammo.btRigidBody(
    new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, shape, groundLocalInertia)
  );

  // physicsWorld.current?.addRigidBody(rigidBody);
}
